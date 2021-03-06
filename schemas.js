const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required().min(0),
  location: Joi.string().required(),
  image: Joi.string().required(),
  description: Joi.string().required(),
});

module.exports.reviewSchema = Joi.object({
  body: Joi.string().required(),
  rating: Joi.number().required().min(1).max(5),
});
// module.exports.userSchema = Joi.object({
//   email: Joi.string().email().required(),
//   username: Joi.string().required(),
//   password: Joi.string().required(),
//   password2: Joi.ref('password'),
// });
