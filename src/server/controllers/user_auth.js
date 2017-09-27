/**
 * @fileoverview Login/Authentication 
 */
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth';

/**
 * 
 * 
 * @export
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
export function authGoogle(req, res) {
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
    return done();
  }
  ));

  passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/userinfo.email']});
}

/**
 * 
 * 
 * @export
 * @param {any} req 
 * @param {any} res 
 */
export function authGoogleCallback(req, res) {
  passport.authenticate('google', {failureRedirect: '/login'},
    function(req, res) {
      res.redirect('/');
    }
  );
}
