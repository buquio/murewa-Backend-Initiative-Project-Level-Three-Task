const jwt = require('jsonwebtoken');
const dotenv = require( 'dotenv');
dotenv.config();


//used inside auth.js & user controller
const generateToken = (data) => { //encrypt
    const token = jwt.sign(
      data,
      data.secret || process.env.TOKEN_SECRET,
      { expiresIn: '24hr' }
    );
    return token;
  }


  /////////////
  const decodeToken = (data) => { //deencrypt
    try {
      return jwt.verify(data.token, data.secret || process.env.TOKEN_SECRET);
    } catch (error) {
      throw error;
    }
  }

module.exports = {generateToken, decodeToken};
