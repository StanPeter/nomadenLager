var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");
var Campground  = require("../models/campground");
var async       = require("async");
var nodemailer  = require("nodemailer");
var crypto      = require("crypto"); //part of express


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

//forgot password NEW
router.get("/forgot", function(req, res) {
    res.render("registration/forgot");
});

//forgot password CREATE
router.post("/forgot", function(req, res, next){
    async.waterfall([
        //creating random token of 20length 
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString("hex");
                done(err, token);
            });
        },
        //passing token to the user and setting for 1hour
        function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if(!user) {
                    req.flash("error", "No account with that email address exists");
                    return res.redirect("/forgot");
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; //1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        //email automat to send the forgotten password link
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "bestcampground@gmail.com",
                    pass: process.env.CAMPGROUNDPASSWORD
                }
            });
            var mailOptions = {
                to: user.email,
                from: "bestcampground@gmail.com",
                subject: "Forgotten password from your campground",
                text: 'You are receiving this because you have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                console.log("mail sent");
                req.flash("success", "An e-mail has been sent to ' + user.email + ' with further instructions.");
                done(err, "done");
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
});

//reset password resend link(token) GET
router.get("/reset/:token", function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if(!user) {
            req.flash("error", "Password reset token invalid or has expired");
            return res.redirect("/forgot");
        }
        res.render("registration/reset", { token: req.params.token });
    });
});

//reset password resend link(token) POST
router.post("/reset/:token", function(req, res){
    async.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user){
               if(!user){
                   req.flash("error", "Password reset token is invalid or has expired");
                   return res.redirect("back");
               } 
               if(req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function(err){
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function(err) {
                            req.logIn(user, function(err) {
                                done(err, user);
                            });
                        });
                    });
                } else {
                    req.flash("error", "Passwords do not match");
                    return res.redirect("back");
                }
            });
        },
        function(user, done){
            var smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "bestcampground@gmail.com",
                    pass: process.env.CAMPGROUNDPASSWORD
                }
            });
            var mailOptions = {
                to: user.email,
                from: "bestcampground@gmail.com",
                subject: "Your password has been changed",
                text: "Hello, \n \n" + 
                "This is a confirmation that the password for your account " + user.email + " has just been changed. \n"
            };
            smtpTransport.sendMail(mailOptions, function(err){
                req.flash("success", "Success! Your password has been changed");
                done(err);
            });
        }
    ], function(err) {
        res.redirect("/campgrounds");
    });
});

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





module.exports = router;