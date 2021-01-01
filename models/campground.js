const mongoose = require('mongoose');

const { Schema } = mongoose;

const campSchema = new Schema({
  title: String,
  price: Number,
  image: String,
  description: String,
  location: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
});

const Campground = mongoose.model('Campground', campSchema);

module.exports = Campground;
