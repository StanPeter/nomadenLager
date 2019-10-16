//all required libraries
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose")

//connection to mongoDB
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true, useUnifiedTopology: true });

//setting for YelpCamp project
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//model for campground
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

/*

var camps = [
    {name:"L'Amfora", image:"https://static.alanrogers.com/images/generated/f7814f82205277e5/ES80350-info-01_720_540_75_s_c1.jpg"},
    {name:"Norway-Fjord", image:"https://www.fjordnorway.com/imageresizer/?image=%2Fdbimgs%2Fsande-camping-turid-sande-beinnes.jpg&action=Background_Overlay" },
    {name:"Camping De Molignon", image:"https://static.alanrogers.com/images/generated/3d782eeb65eebd6b/CH9670-info-01_720_540_75_s_c1.jpg" },
    {name:"Peruvian Andes", image:"https://previews.123rf.com/images/belikova/belikova1802/belikova180200006/94623178-camping-in-the-peruvian-andes-salkantay-trekking-peru-.jpg" },
    {name:"Lagos de Somiedo", image:"https://about-spain.net/tourism/photos/camping-spain.jpg" },
    {name:"Lagos de Somiedo", image:"https://about-spain.net/tourism/photos/camping-spain.jpg"},
    {name:"L'Amfora", image:"https://static.alanrogers.com/images/generated/f7814f82205277e5/ES80350-info-01_720_540_75_s_c1.jpg" },
    {name:"Norway-Fjord", image:"https://www.fjordnorway.com/imageresizer/?image=%2Fdbimgs%2Fsande-camping-turid-sande-beinnes.jpg&action=Background_Overlay" },
    {name:"Camping De Molignon", image:"https://static.alanrogers.com/images/generated/3d782eeb65eebd6b/CH9670-info-01_720_540_75_s_c1.jpg" },
]; 

camps.forEach(function(camp){
    Campground.create(
        {
        name:camp["name"], image:camp["image"]
    }, function(err, newCamp){
        if(err){
            console.log(err);
        } else{
            console.log("SUCCEDED");
        }
    });
}); 

*/

app.post("/campgrounds", function(req, res){
    //get data from form and add to camps array
    var name = req.body.campName;
    var image = req.body.campImg;
    
    Campground.create({
        name:name,
        image:image
    }, function(err, newCamp){
        if(err){
            console.log(err);
        } else{
            console.log("CREATED:" + newCamp);
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds", function(req, res){
    //create a new campground ans save to DB
    Campground.find({}, function (err, allCamps) {
        if(err) {
            console.log(err);
        } else {
            res.render("index", {camps:allCamps});
        }
    });
});

app.get("/campgrounds/add", function(req, res){
    res.render("campgrounds-add");
});

app.listen(3000, function(){
    console.log("You have launched YelpCamp! Well done");
    console.log("Please go to url 'localhost:3000'");
});

