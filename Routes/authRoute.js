const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();

// const validatePassword = (req, res, next) => {
//   const { password, confirmPassword } = req.body;
//   if (password !== confirmPassword) {
//     req.flash('match', "Password doesn't match");

//     return res.redirect('/register');
//   }
//   next();
// };

router.get('/register', (req, res) => {
  res.render('userAuth/register');
});
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await new User({ username, email });

    //! The Register method come from passport-local-mongoose isnted of Save
    await User.register(user, password);
    req.flash('success', 'Registred Succefully');
    res.redirect('/campgrounds');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/register');
  }
});

router.get('/login', (req, res) => {
  res.render('userAuth/login');
});
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res) => {
  req.flash('success', 'Welcome Back!');
  res.redirect('/campgrounds');
});
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'See you!');
  res.redirect('/campgrounds');
});

module.exports = router;
