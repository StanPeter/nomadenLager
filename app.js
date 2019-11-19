//all required libraries
var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    dotenv           = require("dotenv").config(),
    flash            = require("connect-flash"),
    passport         = require("passport"),
    methodOverride   = require("method-override"),
    LocalStrategy    = require("passport-local"),
    User             = require("./models/user"),
    Campground       = require("./models/campground"),
    Comment          = require("./models/comment"),
    seedDB           = require("./seeds")

var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")


    
//connection to mongoDB
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true, useUnifiedTopology: true });


//setting for YelpCamp project
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//seed database to start with some data
// seedDB()

//flash message
app.use(flash());

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

//middleware for access currentUser data on every route
app.use(function(req, res, next){
    res.locals.currentUser  = req.user;
    res.locals.error        = req.flash("error");
    res.locals.success      = req.flash("success");
    next();
});


app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(3000, function(){
    console.log("You have launched YelpCamp! Well done");
    console.log("Please go to url 'localhost:3000'");
});

