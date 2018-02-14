// Importing needed modules
import passportLocal from 'passport-local'
import bCrypt from 'bcrypt-nodejs'
import mongoose from 'mongoose'

const LocalStrategy = passportLocal.Strategy

const User = mongoose.model('User')

const createHash = (password) => bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)

const local_signup = (passport) => {
  passport.use('signup', new LocalStrategy({
    passReqToCallback: true
  }, (req, username, password, done) => {
    const findOrCreateUser = () => {
      User.findOne({ 'username': username }, (err, user) => {
        if (err) {
          console.log(`Error in sign up ${err}`)
          return done(err)
        }
      
        if (user) {
          console.log(`User already exists`)
          return done(null, false)
        } else {
          let nUser = new User()

          nUser.username = username
          nUser.password = createHash(password)
          nUser.email = req.body.email
          
          User.create(nUser, (err) => {
            if(err) {
              console.log(`Shit, something went wrong`)
              throw err
            }

            console.log(`User created ! Yay !`)
            console.log(nUser)
          })
          return done(null, nUser)
        }
      })
    }

    process.nextTick(findOrCreateUser)
  }))
}

module.exports = local_signup