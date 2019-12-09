var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


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
    //putting data together
    var newCampground = {name:name, image:image, price:price, description:desc, author:author};
    
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
    //find the campground by id and update
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        req.flash("success", "Campground successfuly updated.");
        res.redirect("/campgrounds/" + req.params.id);
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

