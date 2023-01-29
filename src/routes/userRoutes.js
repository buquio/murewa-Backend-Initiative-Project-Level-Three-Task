const express = require('express');
const passport = require('passport')

const User = require('../controllers/userController');
const Validation = require('../validation/userValidation');
const Auth = require('../middlewares/auth');

const router = express.Router();

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }) );

router.get('/facebook/redirect',
    passport.authenticate('facebook'), User.socialLogin
);

router.post('/login', Validation.login, User.login);
router.get('/all', Auth, User.getUser);
router.post('/', Validation.createUser, User.createUser).get('/', Auth, User.getUserById).patch('/', Auth, Validation.updateUser, User.updateUser).delete('/', Auth, User.deleteUser);

router.post('/password/reset',Validation.forgotPassword, User.forgotPassword);
router.put('/password/reset/:resetToken', Validation.resetPassword, User.resetPassword);

module.exports = router;
