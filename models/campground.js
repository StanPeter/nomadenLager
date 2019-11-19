var mongoose = require("mongoose");


//model for campground : SCHEMA
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: String,
    description: String,
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
    