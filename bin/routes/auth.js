// Importing needed modules
import express from 'express'
import passport from 'passport'

// Setting needed constants
const router = express.Router()

require('../helpers/passport/local_login')(passport)
require('../helpers/passport/local_signup')(passport)
require('../helpers/passport/facebook')(passport)
require('../helpers/passport/twitter')(passport)
require('../helpers/passport/google')(passport)

router.get('/login', function(req, res) {
  res.render('auth/login')
})

router.get('/facebook', passport.authenticate('facebook', {
  scope : ['public_profile', 'email']
}))

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect : '/',
  failureRedirect : '/auth/login'
}))

router.get('/login/twitter', passport.authenticate('twitter'))

router.get('/login/twitter/return', passport.authenticate('twitter',
  { 
    failureRedirect: '/login' 
  }),
  (req, res) => { 
    res.redirect('/')
  }
)

router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile']
}))

router.get('/auth/google/callback', passport.authenticate('google',
  {
    failureRedirect: '/login'
  }),
  function(req, res) {
    res.redirect('/')
  }
)

router.get('/logout', function(req, res) {
    req.logout()
    res.render('index/index')
})

router.post('/login', passport.authenticate('login', {
  successRedirect : '/',
  failureRedirect : '/auth/signup',
  failureFlash : true
}))

router.get('/signup', function(req, res){
    res.render('auth/signup')
})

router.post('/signup', passport.authenticate('signup', {
    successRedirect : '/',
    failureRedirect :'/auth/signup'
}))

module.exports = router