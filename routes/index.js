var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");


//redirect to index(campgrounds) route
router.get("/", function(req, res){
    res.render("partials/landing");
});

//show register form
router.get("/register", function (req, res) {
    res.render("registration/register");
});

//sing up route for register
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            req.flash("error", err);
            res.render("registration/register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "You successfuly signed up");
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function (req, res) {
    res.render("registration/login");
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
