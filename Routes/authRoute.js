const express = require('express');
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

router.get('/', (req, res) => {
  res.render('userAuth/register');
});
router.post('/', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await new User({ username, email });
    //! The Register method come from passport-local-mongoose isnted of Save
    await User.register(user, password);
    req.flash('success', 'Registred Succefully');
    res.redirect('/');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/register');
  }
});

module.exports = router;
