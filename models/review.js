const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const reviewSchema = new Schema({
  rating: Number,
  body: String,
});
const Review = model('Review', reviewSchema);

module.exports = Review;
