// getting-started.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cat_app', { useNewUrlParser: true, useUnifiedTopology: true });


//add a new cat to the database, also MONGODB 
//needs to be active in another terminal! push  "mongo"
var kittySchema = new mongoose.Schema({
    name: String, //creates a new schema necessary to start
    age: Number,
    temperament: String
});

var Kitten = mongoose.model('Kitten', kittySchema);
//Kitten is just a singular form, plural is made automatically by mongoose

/*
var george = new Kitten({
    name: "George",
    age: 11,
    temperament: "Grouchy"
})

//saving to the database if not any err
george.save(function(err, cat){
    if(err){
        console.log("Something went wrong");
    } else{
        console.log("We just saved a cat to the DB");
        console.log(cat);
    }
});

Kitten.find({}, function(err, cats){
    if(err){
        console.log("OH NOOOO, Error :(");
        console.log(err);
    } else{
        console.log(cats);
    }
}) */

//create method creates and saves in the same time

Kitten.create({
    name: "Snow White",
    age: 15,
    temperament: "Nice" 
}, function(err, cat){
    if(err){
        console.log(err);
    }else{
        console.log(cat);
    }
});