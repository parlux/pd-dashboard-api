const passport = require('koa-passport')
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.PD_DASHBOARD_API_GOOGLE_CLIENT_ID,
    clientSecret: process.env.PD_DASHBOARD_API_GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // At this point we'll send the token to the API and expect either a token back or
    // an error
    return done(null, profile)
  }
))