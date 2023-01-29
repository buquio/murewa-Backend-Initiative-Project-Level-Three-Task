const crypto = require('crypto');
const mongoose =require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    password: { type: String, required: false, trim: true },
    facebookId: { type: Number, required: false },
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  { timestamps: true }
);

userSchema.methods.createPasswordResetToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(32).toString('hex');
  // Hash token and set to resetPasswordToken field
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken, 'utf8')
    .digest('hex');

  // Set expire
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

const Users = mongoose.model('Users', userSchema);
module.exports = Users;
