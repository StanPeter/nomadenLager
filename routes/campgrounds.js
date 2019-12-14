var express      = require("express");
var router       = express.Router();
var Campground   = require("../models/campground");
var middleware   = require("../middleware");
var NodeGeocoder = require('node-geocoder');
var multer       = require("multer");
var cloudinary   = require('cloudinary'); //cloud for images


//store image using multer
var storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});

//checks .extension
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter })

//coonfiguration for cloudinary
cloudinary.config({
    cloud_name: 'dyhtn4yvw',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


//showing google map in campground - show.ejs
var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODE_API_KEY,
    formatter: null
};

var geocoder = NodeGeocoder(options);


//INDEX show all campgrounds
router.get("/", function (req, res) {
    var noMatch = null;

    if (req.query.search) {
        //security for malicious queries
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        Campground.find({name: regex}, function (err, allCampgrounds) {
            if (err) {
                console.log(err);
            } else {
                if (allCampgrounds.length < 1) {
                    noMatch = "No campgrounds match that query, please try again.";
                }
                res.render("campgrounds/index", {campgrounds: allCampgrounds, noMatch: noMatch});
            }
        });
    } else {
        // Get all campgrounds from DB
        Campground.find({}, function (err, allCampgrounds) {
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/index", {campgrounds: allCampgrounds, noMatch: noMatch});
            }
        });
    }
});

//NEW display form for a new campground
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});


//CREATE add a new campground to DB
router.post("/", middleware.isLoggedIn, upload.single("campImage"), function (req, res) {
    //get data from form and add to camps array
    var name = req.body.campName;
    var price = req.body.campPrice;
    var desc = req.body.campDesc;
    var author = {
        id: req.user._id, 
        username: req.user.username
    };
    //google map location
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            req.flash("error", "Invalid address");
            console.log(err);
            return res.redirect("back");
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;

        
        cloudinary.v2.uploader.upload(req.file.path, function (err, result) {
            if(err){
                req.flash("error", err.message);
                return res.redirect("back");
            }
            // add cloudinary url for the image to the campground object under image property
            req.body.campImage = result.secure_url;
            var image = req.body.campImage;
            var imageId = result.public_id;

            //putting data together
            var newCampground = { name: name, image: image, price: price, description: desc, author: author, location: location, lat: lat, lng: lng, imageId: imageId };


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
router.put("/:id", middleware.checkUsersRights, upload.single("campground[image]"), function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;

        //find campground and upload the image
        Campground.findById(req.params.id, function(err, foundCampground){
            if (req.file) {
                //destroy the old image
                cloudinary.v2.uploader.destroy(foundCampground.imageId, function (err, result) {
                    if(err){
                        req.flash("error", err.message);
                        return res.redirect("back");
                    }
                    console.log("destroyed");
                    cloudinary.v2.uploader.upload(req.file.path, function (err, result) {
                        if (err) {
                            req.flash("error", err.message);
                            return res.redirect("back");
                        }
                        console.log("uploaded");

                        req.body.campground.image = result.secure_url;
                        foundCampground.imageId = result.public_id;
                        foundCampground.save();
                        console.log("saved");
                    });
                });
            }
        });
        
        //find the campground by id and update
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
            if (err) {
                req.flash("error", err.message);
            } else {
                console.log("updated");
                req.flash("success", "Campground successfuly updated.");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    });
});




//DESTROY campground route
router.delete("/:id", middleware.checkUsersRights, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        req.flash("success", "Campground deleted.");
        res.redirect("/campgrounds");
    });
});


//secure malicious queries in search
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};



module.exports = router;

