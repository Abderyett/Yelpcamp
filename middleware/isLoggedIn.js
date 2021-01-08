const isloggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be Sign in');
    return res.redirect('/login');
  }
  next();
};

module.exports = isloggedIn;