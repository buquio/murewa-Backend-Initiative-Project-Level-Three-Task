const Joi = require('joi');
const Format = require('./schema');
const validator = require('./validator');

const createUser = (req, res, next) =>{
  const format = Joi.object().keys(
    {
      username: Format.string,
      email: Format.email,
      password : Format.string,
    },
    {}
  );     

  validator(format, req.body, res, next);
}

const login = (req, res, next) =>{
  const format = Joi.object().keys(
    {
      username: Format.string,
      password : Format.string,
    },
    {}
  );     

  validator(format, req.body, res, next);
}

const updateUser = (req, res, next) =>{
  const format = Joi.object().keys(
    {
      username: Format.stringOptional,
      email: Format.stringOptional,
    },
    {}
  );     

  validator(format, req.body, res, next);
}

const forgotPassword = (req, res, next) =>{
  const format = Joi.object().keys(
    {
      email: Format.email,
    },
    {}
  );     

  validator(format, req.body, res, next);
}

const resetPassword = (req, res, next) =>{
  const format = Joi.object().keys(
    {
      password : Format.string
    },
    {}
  );     

  validator(format, req.body, res, next);
}

module.exports = {createUser, login, updateUser, forgotPassword, resetPassword}