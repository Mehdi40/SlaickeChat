// Importing needed modules
import passportFacebook from 'passport-facebook'

// Importing needed files
import User from '../../models/user'
import config from '../../config/auth'

// Setting needed constants
const FacebookStrategy = passportFacebook.Strategy

const facebook = (passport) => {
  passport.use('facebook', new FacebookStrategy({
    clientID : config.facebook.clientID,
    clientSecret : config.facebook.clientSecret,
    callbackURL : config.facebook.callback,
    profileFields: ['id', 'emails', 'name']
  }, (token, refreshToken, profile, done) => {
    const loginOrSignUp = function() {
      User.findOne({ 'facebook.id' : profile.id }, (err, user) => {
        if (err)
          return done(err)
                
        if (user) {
          return done(null, user)
        } else {
          var nUser = new User()

          nUser = {
            email: profile.emails[0].value,
            username: profile.emails[0].value,
            facebook: {
              id: profile.id,
              token: token,
              name: profile.name.givenName + ' ' + profile.name.familyName
            }
          }

          nUser.save(function(err) {
            if (err)
              throw err

            return done(null, nUser)
          })
        }
      })
    }
    
    process.nextTick(loginOrSignUp)
  }))
}

module.exports = facebook