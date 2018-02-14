// Importing needed modules
import passportLocal from 'passport-local'
import bCrypt from 'bcrypt-nodejs'
import mongoose from 'mongoose'

// Importing needed models
const User = mongoose.model('User')

// Setting needed constants
const LocalStrategy = passportLocal.Strategy

const isValidPassword = (user, password) => bCrypt.compareSync(password, user.password)

const local_login = (passport) => {
  passport.use('login', new LocalStrategy({
    passReqToCallback: true
  }, (req,username, password, done) => {
    const loginUser = () => {
      User.findOne({ 'username': username }, (err, user) => {
        if(err)
          return done(err)
        
        if(!user) {
          console.log(`No user was found with the username ${username}`)
          return done(null, false)
        }
            
        if(!isValidPassword(user, password)) {
          console.log(`Invalid password`)
            return done(null, false)
        }
        
        return done(null, user)
      })
    }
  process.nextTick(loginUser)
  }))
}

module.exports = local_login