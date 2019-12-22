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
// seedDB();

async function deleteAll() {
    try{
        await Comment.remove({});
        await Campground.remove({});
    } catch(err) {
        console.log(err);
    }
}

deleteAll();

//setting for YelpCamp project
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public/css"));
app.use(express.static(__dirname + "/public/images"));
app.use(express.static(__dirname + "/public/js"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


//flash message
app.use(flash());

//moment counts difference between date of creation/today's date
app.locals.moment = require('moment');

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



app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Listening to port localhost:3000");
});

