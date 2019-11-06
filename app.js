//all required libraries
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")


seedDB()
//connection to mongoDB
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true, useUnifiedTopology: true });

//setting for YelpCamp project
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

//PASSPORT configuration
app.use(require("express-session")({
    secret: "This one is secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//comes all from passport-local-mongoose package
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//this middleware will run on every single route
//pass user data
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// redirects to INDEX
app.get("/", function(req, res){
    res.redirect("/campgrounds");
});

//INDEX homepage for campgrounds
app.get("/campgrounds", function(req, res){
    //create a new campground ans save to DB
    Campground.find({}, function (err, allCamps) {
        console.log(req.user);
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {camps:allCamps, currentUser:req.user});
        }
    });
});

//NEW display form for a new campground
app.get("/campgrounds/add", function (req, res) {
    res.render("campgrounds/new");
});

//CREATE add a new campground to DB
app.post("/campgrounds", function (req, res) {
    //get data from form and add to camps array
    var name = req.body.campName;
    var image = req.body.campImg;
    var desc = req.body.campDesc;

    Campground.create({
        name: name,
        image: image,
        description: desc

    }, function (err, newCamp) {
        if (err) {
            console.log(err);
        } else {
            console.log("CREATED:" + newCamp);
            res.redirect("/campgrounds");
        }
    });
});

//SHOW shows a specific campground
app.get("/campgrounds/:id", function(req, res){ 
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            console.log(foundCampground.comments)
            //change in future to campground all to make more sense + cleaner code
            res.render("campgrounds/show", {camp: foundCampground});
        }
    });    
});

// ============
// COMMENTS ROUTES
// ============


// NEW form for a comment
app.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
    console.log("not done yet");
    
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { camp: campground });
        }
    });
});

// CREATE add a new comment do DB
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    // lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else{
            // create a new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else{
                    campground.comments.push(comment);
                    campground.save();
                    console.log("added sucessfuly");
                    res.redirect("/campgrounds" + campground._id);
                }
            });
        }
    });
    
});
// ==============
// AUTH ROUTES
// ==============

//show register form
app.get("/register", function(req, res){
    res.render("registration/register");
});
//sing up route for register
app.post("/register", function(req, res){
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("registration/register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");   
        });
    });
});
//show logic form
app.get("/login", function(req, res){
    res.render("registration/login");
});
//login route logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});
//logout route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

//authentication security
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    };
    res.redirect("/login");
};

app.listen(3000, function(){
    console.log("You have launched YelpCamp! Well done");
    console.log("Please go to url 'localhost:3000'");
});

