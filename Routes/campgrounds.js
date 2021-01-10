const express = require('express');
const { campgroundSchema } = require('../schemas');
const Campground = require('../models/campground');
const ExpressError = require('../utilities/ExpressError');
const isLoggedIn = require('../middleware/isLoggedIn');
const isloggedIn = require('../middleware/isLoggedIn');

const router = express.Router();

const validateCamp = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//! =========== Add New Camp ==========================
router.get('/new', isLoggedIn, async (req, res) => {
  res.render('campgrounds/new');
});
router.post('/', validateCamp, async (req, res, next) => {
  try {
    const addCamp = new Campground(req.body);
    addCamp.author = req.user._id;

    await addCamp.save();
    req.flash('success', 'Succefully created');
    res.redirect(`/campgrounds/${addCamp._id}`);
  } catch (error) {
    next(error);
  }
});
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const camps = await Campground.findById(id).populate('reviews').populate('author');
    console.log(camps);
    if (!camps) {
      req.flash('error', 'Campground not found');
      res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { camps });
  } catch (error) {
    next(error);
  }
});

//! ======== show all campgrounds  =============
router.get('/', async (req, res, next) => {
  try {
    const camps = await Campground.find({});
    res.render('campgrounds/index', { camps });
  } catch (error) {
    next(error);
  }
});
router.put('/:id', isloggedIn, validateCamp, async (req, res, next) => {
  try {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    req.flash('success', 'Succefully updated');
    res.redirect('/campgrounds');
  } catch (error) {
    next(error);
  }
});
//! ============ Delete Post Camp =================
router.delete('/:id', isloggedIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Succefully deleted');
    res.redirect('/campgrounds');
  } catch (error) {
    next(error);
  }
});
//! ========== Edit Camp ===================
router.get('/:id/edit', isloggedIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    const camps = await Campground.findById(id);
    req.flash('success', 'Succefully edited ');
    res.render('campgrounds/edit', { camps });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
