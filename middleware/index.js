var Campground      = require("../models/campground"),
    Comment         = require("../models/comment");



var middlewareObj   = {};


//authentication security
middlewareObj.isLoggedIn = function(req, res, next){

        if (req.isAuthenticated()) {
            return next();
        };
        res.redirect("/login");
};

//check user's authorization for a campground 
middlewareObj.checkUsersRights = function(req,res ,next){

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

//check user's authorization for a comment 
middlewareObj.checkUsersCommentRights = function(req, res, next){

    if (req.isAuthenticated()) {

        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
                console.log(err);
            } else {
                //check if user owns the comment
                if (foundComment.author.id.equals(req.user._id)) {
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

module.exports = middlewareObj