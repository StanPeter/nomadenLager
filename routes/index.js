var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");

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
            return res.render("registration/register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/campgrounds");
        });
    });
});

//show logic form
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
    res.redirect("/campgrounds");
});

//authentication security
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    };
    res.redirect("/login");
};



module.exports = router;
