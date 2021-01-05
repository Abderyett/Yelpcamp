const express = require('express');
const Review = require('../models/review');
const { reviewSchema } = require('../schemas');
const Campground = require('../models/campground');
const ExpressError = require('../utilities/ExpressError');

const router = express.Router({ mergeParams: true, stritc: true });

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
//! ============ Show details of Camp Reviews & rating  ============

router.post('/', validateReview, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body, rating } = req.body;
    const camps = await Campground.findById(id);
    const review = new Review({ body, rating });
    camps.reviews.push(review);

    await review.save();
    await camps.save();
    req.flash('success', 'Succesfully added');
    res.redirect(`/campgrounds/${camps._id}`);
  } catch (error) {
    next(error);
  }
});
//!  ================= Delete Comments ==================
router.delete('/:reviewId', async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Succesfully deleted');
    res.redirect(`/campgrounds/${id}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
