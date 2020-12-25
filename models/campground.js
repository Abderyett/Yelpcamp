const mongoose = require('mongoose');

const { Schema } = mongoose;

const campSchema = new Schema({
  title: String,
  price: Number,
  image: String,
  description: String,
  location: String,
});

const Campground = mongoose.model('Campground', campSchema);

module.exports = Campground;
