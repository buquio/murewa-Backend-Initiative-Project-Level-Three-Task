const dotenv = require('dotenv');
const passport = require('passport');
const Fs = require('passport-facebook');
const FacebookStrategy = Fs.Strategy;
dotenv.config();

//to get access to facebook authorization
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new FacebookStrategy(
    {
      name: 'facebook',
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/user/facebook/redirect`,
      profileFields: ['emails', 'name']
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        const { email, id } = profile._json;
        const username= email.split('@')[0];
        const facebookId = id;
        const user = { email, username, facebookId };
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);