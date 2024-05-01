const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/Yelpcamp')

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6617cdd7b98b2e6486674104',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry:{
              type : "Point",
              coordinates : [
                cities[random1000].longitude,
                cities[random1000].latitude
              ],
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dqmx7pa9q/image/upload/v1713614671/YelpCamp/mrrt4fiqhchtedwakeov.png',
                  filename: 'YelpCamp/mrrt4fiqhchtedwakeov',
                  
                },
                {
                  url: 'https://res.cloudinary.com/dqmx7pa9q/image/upload/v1713614673/YelpCamp/pa3uwd1jdscpdonfsqf7.png',
                  filename: 'YelpCamp/pa3uwd1jdscpdonfsqf7',
                  
                },
                {
                  url: 'https://res.cloudinary.com/dqmx7pa9q/image/upload/v1713614674/YelpCamp/sogjerzjkycxlycnuwqd.png',
                  filename: 'YelpCamp/sogjerzjkycxlycnuwqd',
                  
                }]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})