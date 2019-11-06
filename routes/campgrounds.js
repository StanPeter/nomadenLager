var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");



//INDEX show all campgrounds
router.get("/", function (req, res) {
    //create a new campground ans save to DB
    Campground.find({}, function (err, allCampgrounds) {
        console.log(req.user);
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user });
        }
    });
});

//NEW display form for a new campground
router.get("/new", function (req, res) {
    res.render("campgrounds/new");
});

//CREATE add a new campground to DB
router.post("/", function (req, res) {
    //get data from form and add to camps array
    var name = req.body.campName;
    var image = req.body.campImg;
    var desc = req.body.campDesc;

    Campground.create({
        name: name,
        image: image,
        description: desc

    }, function (err, newCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log("CREATED:" + newCampground);
            res.redirect("/campgrounds");
        }
    });
});

//SHOW shows a specific campground
router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground.comments)
            //change in future to campground all to make more sense + cleaner code
            res.render("campgrounds/show", {campground: foundCampground });
        }
    });
});



module.exports = router;

