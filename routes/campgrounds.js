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
router.get("/new", isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

//CREATE add a new campground to DB
router.post("/", isLoggedIn, function (req, res) {
    //get data from form and add to camps array
    var name = req.body.campName;
    var image = req.body.campImg;
    var desc = req.body.campDesc;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    //putting data together
    var newCampground = {name:name, image:image, description:desc, author:author};
    
    Campground.create(newCampground, function (err, newCamp) {
        if (err) {
            console.log(err);
        } else {
            console.log("CREATED:" + newCamp);
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

//EDIT campground route
router.get("/:id/edit", checkUsersRights, function(req, res){
    //check if user logged in
    if(req.isAuthenticated()){
        
        Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground:foundCampground}); 
        });    
    }
});

//UPDATE campground route
router.put("/:id", checkUsersRights, function(req, res){
    //find the campground by id and update
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        res.redirect("/campgrounds/" + req.params.id);
    });
});

//DESTROY campground route
router.delete("/:id", checkUsersRights, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        res.redirect("/campgrounds");
    });
});

//authentication security middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    };
    res.redirect("/login");
};

//check user's rights for a campground 
function checkUsersRights(req, res, next){
    if (req.isAuthenticated()) {

        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                res.redirect("back");
                console.log(err);
            } else {
                //check if user owns the campground
                //woudn't work with campground.author.id === req.user._id --> object vs string
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.send("You don't have neccesary permission for this");
                }
            }
        });
    } else {
        //redirect to the previous webpage
        res.redirect("back");
    };
}



module.exports = router;

