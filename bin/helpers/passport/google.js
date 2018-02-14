// Importing needed modules
import passportGoogle from 'passport-google'

// Importing needed files
import User from '../../models/user'
import config from '../../config/auth'

// Setting needed constants
const GoogleStrategy = passportGoogle.Strategy

const google = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    returnURL: 'http://localhost:3000/auth/auth/google/callback',
    realm: 'http://localhost:3000/'
  },
  (token, refreshToken, profile, done) => {
    const loginOrSignUp = function() {
      User.findByOpenID({ openId: identifier }, (err, user) => {
        if (err)
          return done(err)
                
        if (user) {
          return done(null, user)
        } else {
          var nUser = new User()

          nUser = {
            email: profile.emails[0].value,
            username: profile.emails[0].value,
            google: {
              id: profile.id,
              token: token
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

module.exports = google