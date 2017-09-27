import express from 'express';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth';

//import * as authController from '../controllers/user_auth';

import * as userController from '../controllers/user';

const router = express.Router();
export default router;

router.get('/', userController.index);
router.get('/login', userController.login);

// Passport setup
passport.use(new GoogleStrategy.OAuth2Strategy({
  clientID: '741961836801-v58t7bv2t08jglenlj9vlvh6usr57l2d.apps.googleusercontent.com',
  clientSecret: 'PndOco4Zzj4RZin_nHrPNsnH',
  callbackURL: 'https://pmpc1465.npm.ac.uk/geona/user/auth/google/callback',
},
function(token, tokenSecret, profile, done) {
  // User.findOrCreate({ googleId: profile.id }, function (err, user) {
  //   return done(err, user);
  // });
  return done(null, profile);
}
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', successRedirect: '/success' }),
  function(req, res) {
    res.redirect('/');
  }
);

//router.get('/auth/github', authController.authGoogle);
//router.get('/auth/github/callback', authController.authGoogleCallback);
