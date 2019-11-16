var express     = require("express");
var router      = express.Router({mergeParams: true});
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");
var middleware  = require("../middleware");


// NEW form for a comment
router.get("/new", middleware.isLoggedIn, function(req, res){

    console.log(req.params.id);
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong.");
            res.redirect("back");
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// CREATE add a new comment do DB
router.post("/", middleware.isLoggedIn, function(req, res) {
    // lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong.");
            res.redirect("back");
        } else {
            // create a new comment
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    //add 'user' and 'id' to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment/campground
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();

                    req.flash("success", "Comment successfully created.");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });

});

//EDIT comment
router.get("/:comment_id/edit", middleware.checkUsersCommentRights, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong.");
            res.redirect("/campgrounds/" + req.params.id);
        } else{
            res.render("comments/edit", { campground_id: req.params.id, comment:foundComment});
        }
    });
});

//UPDATE comment
router.put("/:comment_id", middleware.checkUsersCommentRights, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong.");
            res.redirect("/campgrounds/" + req.params.id);
        } else{
            req.flash("success", "Comment successfully updated.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY comment
router.delete("/:comment_id", middleware.checkUsersCommentRights, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong.");
            res.redirect("/campgrounds/" + req.params.id);
        } else{
            req.flash("success", "Comment successfully deleted.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});




module.exports = router;