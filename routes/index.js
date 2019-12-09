var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");
var Campground  = require("../models/campground");


//redirect to index(campgrounds) route
router.get("/", function(req, res){
    res.render("partials/landing");
});

//show register form
router.get("/register", function (req, res) {
    res.render("registration/register");
});

//for testing to delete all users
async function deleteUsers() {
    try {
        // remove users
        await User.remove({});
    } catch (err) {
        console.log(err);
    }
}



//sing up route for register
router.post("/register", function (req, res) {
    // deleteUsers();
    var newUser = new User(
        {
            username: req.body.username,
            password: req.body.password,
            avatar: req.body.avatar,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        }
    );
    console.log(newUser);
    // eval(require("locus")); //freezes code on this line, used only for debugging
    if (req.body.adminCode === "secretcode123") {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            req.flash("error", err);
            res.render("registration/register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "You successfuly signed up" + req.body.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function (req, res) {
    res.render("registration/login", { page: 'login' });
});


//login route logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function (req, res) {
    });
    
//logout route
router.get("/logout", function (req, res) {
    req.logout();

    req.flash("success", "You successfully logged out.")
    res.redirect("/campgrounds");
});



module.exports = router;

//USER ROUTES
router.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("/campgrounds");
        } 
        Campground.find().where("author.id").equals(foundUser._id).exec(function(err, foundCampgrounds){
            if(err) {
                req.flash("error", "Something went wrong");
                res.redirect("/campgrounds");
            } 
            res.render("users/show", {user: foundUser, campgrounds: foundCampgrounds});    
        });
    });
});
