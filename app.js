const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStratery = require('passport-local');
const ExpressError = require('./utilities/ExpressError');
const campgroundRoutes = require('./Routes/campgrounds');
const authRoute = require('./Routes/authRoute');
const reviewRoutes = require('./Routes/review');
const User = require('./models/user');
const isLoggedIn = require('./middleware/isLoggedIn');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database Connected');
});
mongoose.set('useCreateIndex', true);

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(
  session({
    secret: 'thissouldbebettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
//! we should set passport.session after The SESSION
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratery(User.authenticate()));

//* How to Store User in the Session
passport.serializeUser(User.serializeUser());
//* How to User Out of that session
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req, res, next) => {
  console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  // req.locals.match = req.flash('match');
  next();
});
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/review', reviewRoutes);
app.use('/', authRoute);

app.get('/', isLoggedIn, (req, res) => {
  res.render('home');
});

// ! ================ Error   Handler ===============
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something Went Wrong';
  res.status(statusCode).render('campgrounds/error', { err });
});

app.listen(2000, () => {
  console.log('Running on Port 2000...');
});
