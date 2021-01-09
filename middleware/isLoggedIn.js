const isloggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be Sign in');

    req.session.retunTo = req.originalUrl;
    return res.redirect('/login');
  }
  next();
};

module.exports = isloggedIn;
