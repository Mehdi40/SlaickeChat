const isAuth = (req, res, next) => { 
  // If the user is authenticated, we continue
    if (req.isAuthenticated())
      return next();
    
  // If the user isn't authenticated,
  // We redirect it to the login page
    res.redirect('/auth/login')
}

module.exports = isAuth