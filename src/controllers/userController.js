const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

const Users = require('../models/users');
const { hash, genSalt, compareSync } = require('bcrypt');
const {generateToken} = require('../utils/SessionHandler');

const { successResponse, errorResponse } = require( '../utils/response');


// signup
const createUser = async (req, res, next) => {
  try {
    const data = req.body; //newpassword
    const {username, email }= req.body;
//to signup first see if the username does not exit before
    const user = await Users.findOne({username, email});
    if (user) return errorResponse(res, 409, 'User already exists'); 
//save and hash the new password
    const salt = await (0, genSalt)(10);
    const newPassword = await hash(data.password, salt);
    data.password = newPassword;
//create user by storing the username,email & pwd and generate token(unique number)
    const result = await Users.create(data);    
    const token = await generateToken({_id:result._id, username});
    
    return successResponse(res, 201, 'Users created successfully', {username, token});
  } catch (err) {
    return next(err);
  }
};


//login
const login = async (req, res, next) => {
  const data = req.body;
  const {username} = req.body;

  try {
    const user = await Users.findOne({ username });
    if (!user) return errorResponse(res, 404, 'User does not exist');

    if (user.password === undefined) return errorResponse(res, 404, 'Did you sign up using Facebook? If yes, please log in via your Facebook account');

    const passwordCorrect = compareSync(data.password, user.password);
    if (!passwordCorrect) {
      return errorResponse(res, 400, 'Incorrect password');
    }

    const token = await generateToken({_id:user._id, username});
    return successResponse(res, 200, 'Login successful', {username, token});
  } catch (err) {
    return next(err);
  }
}

const socialLogin = async (req, res, next) =>{
  try{
    const { username, email, facebookId } = req.user;
    let user;
    user = await Users.findOne({ username, email });
    if (!user) {
      user = await Users.create({ username, email, facebookId });
    }

    const token = await generateToken({_id:user._id, username});
    
    return successResponse(res, 200, 'Login successful', {username, token});
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

// This function should only be accessible by admins. However, it is not in the requirement for this level to implement user roles.
// For now, any authenticated person can access this function.
const getUser = async (req, res, next) => {
  try {
    const result = await Users.find({}).select('-password');

    return successResponse(res, 200, 'Users retrieved successfully', result);
  } catch (err) {
    return next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const {_id}= req.user;
    const result = await Users.findOne({_id}).select('-password');

    return successResponse(res, 200, `User ${_id} retrieved successfully`, result);
  } catch (err) {
    return next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const {_id}= req.user;
    const data = req.body;
    const {username, email }= req.body;
    let user, result;

    if (Object.keys(data).length === 0) return errorResponse(res, 404, 'Please provide the email or username to update');
    
    // Check if the username or email already exists and if it belongs to another user
    if (username){
      user =  await Users.findOne({username});
      if (user && user._id != _id) return errorResponse(res, 409, 'Username already taken'); 
      result = await Users.findOneAndUpdate({_id}, {username}).select('-password');     
    }
    else if (email){
      user =  await Users.findOne({email});
      if (user && user._id != _id) return errorResponse(res, 409, 'Email already taken'); 
      await Users.findOneAndUpdate({_id}, {email}).select('-password');      
    }

    return successResponse(res, 200, `User updated successfully`, result);
  } catch (err) {
    return next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const {_id}= req.user;
    const result = await Users.findByIdAndDelete({_id});
    if (!result) return errorResponse(res, 404, 'User does not exist or has been deleted'); 

    return successResponse(res, 200, 'User deleted successfully');
  } catch (err) {
    return next(err);
  }
};

/**
 * Generate reset password token
 * @returns {object} response object
 */
const createPasswordResetToken = () => {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  const resetPasswordToken = crypto
  .createHash('sha256')
  .update(resetToken, 'utf8')
  .digest('hex');

  // Set expire
  const resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return { resetToken, resetPasswordToken, resetPasswordExpire };
};

/**
 * User's password reset request
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {next} next - next middleware
 * @returns {object} custom response
 */
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await Users.findOne({email});
    if (user.facebookId) return errorResponse(res, 404, 'Did you sign up using Facebook? If yes, please log in via your Facebook account');
    if (!user)
      return successResMsg(res, 201, { message: 'Password reset successful' });

    const { resetToken, resetPasswordToken, resetPasswordExpire } = createPasswordResetToken();
    
    await Users.updateOne({ email }, { resetPasswordToken, resetPasswordExpire });

    return successResponse(res, 201, 'Password reset successful', {'password-reset-token': resetToken} );
  } catch (err) {
    return next(err);
  }
};

/**
 * Resets a user's password
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {next} next - next middleware
 * @returns {object} custom response
 */
const resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const { resetToken } = req.params;
    const { password } = req.body;
    const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken, 'utf8')
    .digest('hex');

    const user = await Users.findOne({resetPasswordToken});
    if (!user) {
      return errorResponse(res, 400, 'Invalid token');
    }

    if (user.resetPasswordExpire < Date.now()) {
      return errorResponse(res, 400, 'Reset password token expired');
    }

    // hash password before saving
    const salt = await (0, genSalt)(10);

    // Set new password
    user.password = await hash(password, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    user.save();

    return successResponse(res, 200, 'Password changed successfully');
  } catch (err) {
    return next(err);
  }
};

module.exports = { 
    createUser, getUser, getUserById, updateUser, deleteUser, 
    login, socialLogin, forgotPassword, resetPassword
};
