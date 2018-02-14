const isBanned = (req, res, next) => { 
  // If the user is banned, we redirect to login
    if (req.session.passport.user.ban == true)
      res.redirect('/')
      
    // If the user isn't banned,
    // We continue
    return next();
}

module.exports = isBanned