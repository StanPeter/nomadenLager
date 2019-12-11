var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');


//showing google map in campground - show.ejs
var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODE_API_KEY,
    formatter: null
};

var geocoder = NodeGeocoder(options);


//INDEX show all campgrounds
router.get("/", function (req, res) {
    //create a new campground ans save to DB
    Campground.find({}, function (err, allCampgrounds) {
        console.log(req.user);
        if(err) {
            req.flash("error", "Something went wrong, please try again later.");
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
        }
    });
});

//NEW display form for a new campground
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});


//CREATE add a new campground to DB
router.post("/", middleware.isLoggedIn, function (req, res) {
    //get data from form and add to camps array
    var name = req.body.campName;
    var image = req.body.campImg;
    var price = req.body.campPrice;
    var desc = req.body.campDesc;
    var author = {
        id: req.user._id, 
        username: req.user.username
    };
    //google map location
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
    //putting data together
        var newCampground = { name: name, image: image, price: price, description: desc, author: author, location: location, lat: lat, lng: lng};
        
        Campground.create(newCampground, function (err, newCamp) {
            if (err) {
                console.log(err);
                req.flash("error", "Something went wrong.");
                res.redirect("/campgrounds");
            } else {
                req.flash("success", "Campground successfully created.");
                res.redirect("/campgrounds");
            }
        });
    });
});


//SHOW shows a specific campground
router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err || !foundCampground) {
            console.log(err);
            req.flash("error", "Campground not found!");
            res.redirect("/campgrounds");
        } else {
            //change in future to campground all to make more sense + cleaner code
            res.render("campgrounds/show", {campground: foundCampground });
        }
    });
});

//EDIT campground route
router.get("/:id/edit", middleware.checkUsersRights, function(req, res){
    //check if user logged in
    if(req.isAuthenticated()){
        
        Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground:foundCampground}); 
        });    
    }
});

//UPDATE campground route
router.put("/:id", middleware.checkUsersRights, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
        //find the campground by id and update
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
            if (err) {
                req.flash("error", err.message);
            } else {
                req.flash("success", "Campground successfuly updated.");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    });
});




//DESTROY campground route
router.delete("/:id", middleware.checkUsersRights, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        req.flash("success", "Campground deleted.");
        res.redirect("/campgrounds");
    });
});



module.exports = router;

