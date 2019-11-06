var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment    = require("../models/comment");



// NEW form for a comment
router.get("/new", isLoggedIn, function(req, res) {

    console.log(req.params.id);
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", { camp: campground });
        }
    });
});

// CREATE add a new comment do DB
router.post("/", isLoggedIn, function(req, res) {
    // lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // create a new comment
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();

                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });

});

//authentication security middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    };
    res.redirect("/login");
};


module.exports = router();