const mongoose = require('mongoose');
const _ = require('lodash');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelper');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database Connected');
});

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '5ff9dfc54593ec2cbe24e28f',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${_.sample(places)} ${_.sample(descriptors)}`,
      image: 'https://source.unsplash.com/collection/1114848',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe optio voluptate quam rerum est excepturi. Similique, sit neque vitae ab, velit alias debitis architecto ex saepe numquam, possimus sequi accusamus.',
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
