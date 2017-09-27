/** @module config_passport */
/**
 * @fileoverview Loads the OAuth strategies for the various providers
 */
import passport from 'passport';
import * as config from './config.js';
import GoogleStrategy from 'passport-google-oauth';
import GitHubStrategy from 'passport-github2';

/**
 * Add the OAuth strategies to passport
 * 
 * @export
 */
export function configureOauthProviders() {
  // These should be loaded from config, but that will come later; for now, hard coded values: 
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

  // Again, these should come from config
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

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
}
