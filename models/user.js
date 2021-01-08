const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const { Schema, model } = mongoose;

const userScehma = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

//* Passport-Local_Mongoose gonna to add username and password
//* to our userSchema +  other methods
userScehma.plugin(passportLocalMongoose);

const User = model('User', userScehma);

module.exports = User;
