// Importing needed modules
import passportTwitter from 'passport-twitter'

// Importing needed files
import User from '../../models/user'
import config from '../../config/auth'

// Setting needed constants
const TwitterStrategy = passportTwitter.Strategy

const twitter = (passport) => {
  passport.use(new TwitterStrategy({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: "http://localhost:3000/auth/login/twitter/return"
  },
  (token, refreshToken, profile, done) => {
    const loginOrSignUp = function() {
      User.findOne({ 'twitter.id': profile.id }, (err, user) => {
        if (err)
          return done(err)
                
        if (user) {
          return done(null, user)
        } else {
          var nUser = new User()

          nUser = {
            username: profile.displayName,
            twitter: {
              id: profile.id,
              token: token
            }
          }

          User.create(nUser, function(err) {
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

module.exports = twitter