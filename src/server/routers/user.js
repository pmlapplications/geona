import express from 'express';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth';
import GitHubStrategy from 'passport-github2';

//import * as authController from '../controllers/user_auth';

import * as userController from '../controllers/user';

const router = express.Router();
export default router;

router.get('/', userController.index);
router.get('/login', userController.login);


/**
 * GOOGLE OAUTH CONFIG
 */
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

/**
 * GITHUB OAUTH CONFIG
 */
passport.use(new GitHubStrategy({
  clientID: '1e3f16cdf86532f5e0a5',
  clientSecret: 'b925c897f3968fa2dcea10ba88d530beaa6239de',
  callbackURL: 'https://pmpc1465.npm.ac.uk/geona/user/auth/github/callback',
},
function(token, tokenSecret, profile, done) {
  // User.findOrCreate({ githubId: profile.id }, function (err, user) {
  //   return done(err, user);
  // });
  return done(null, profile);
}
));

router.get('/auth/github',
  passport.authenticate('github', { scope: ['https://www.githubapis.com/auth/plus.login'] })
);

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login', successRedirect: '/success' }),
  function(req, res) {
    res.redirect('/');
  }
);

