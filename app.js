//all required libraries
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds")


seedDB()
//connection to mongoDB
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true, useUnifiedTopology: true });

//setting for YelpCamp project
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));



app.get("/", function(req, res){
    res.redirect("/campgrounds");
});

//FORM FOR ADD A NEW CAMPGROUND
app.post("/campgrounds", function(req, res){
    //get data from form and add to camps array
    var name = req.body.campName;
    var image = req.body.campImg;
    var desc = req.body.campDesc;
    
    Campground.create({
        name:name,
        image:image,
        description:desc

    }, function(err, newCamp){
        if(err){
            console.log(err);
        } else{
            console.log("CREATED:" + newCamp);
            res.redirect("/campgrounds");
        }
    });
});
//INDEX(HOME) PAGE CAMPGROUNDS
app.get("/campgrounds", function(req, res){
    //create a new campground ans save to DB
    Campground.find({}, function (err, allCamps) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds-index", {camps:allCamps});
        }
    });
});
//ADD A CAMPGROUND PAGE
app.get("/campgrounds/add", function(req, res){
    res.render("campgrounds-add");
});

//SHOW campground route
app.get("/campgrounds/:id", function(req, res){ 
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            console.log(foundCampground.comments)
            //change in future to campground all to make more sense + cleaner code
            res.render("campgrounds-show", {camp: foundCampground});
        }
    });    
});





app.listen(3000, function(){
    console.log("You have launched YelpCamp! Well done");
    console.log("Please go to url 'localhost:3000'");
});

