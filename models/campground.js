var mongoose = require("mongoose");


//model for campground : SCHEMA
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    imageId: String,
    price: String,
    description: String,
    location: String,
    lat: Number, //lat + lng for location
    lng: Number,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

// without module.exports woudn't get any data
module.exports = mongoose.model("Campground", campgroundSchema);
    