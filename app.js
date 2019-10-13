var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


var camps = [
    {name: "Lagos de Somiedo", img:"https://about-spain.net/tourism/photos/camping-spain.jpg"},
    {name: "L'Amfora", img: "https://static.alanrogers.com/images/generated/f7814f82205277e5/ES80350-info-01_720_540_75_s_c1.jpg"},
    {name: "Norway-Fjord", img: "https://www.fjordnorway.com/imageresizer/?image=%2Fdbimgs%2Fsande-camping-turid-sande-beinnes.jpg&action=Background_Overlay" },
    {name: "Camping De Molignon", img: "https://static.alanrogers.com/images/generated/3d782eeb65eebd6b/CH9670-info-01_720_540_75_s_c1.jpg" },
    {name: "Peruvian Andes", img: "https://previews.123rf.com/images/belikova/belikova1802/belikova180200006/94623178-camping-in-the-peruvian-andes-salkantay-trekking-peru-.jpg" },
];

app.post("/campgrounds", function(req, res){
    //get data from form and add to camps array
    var name = req.body.campName;
    var img = req.body.campImg;
    var newCamp = {name: name, img:img};

    camps.push(newCamp);
    res.redirect("/campgrounds");
});

app.get("/campgrounds", function(req, res){
    res.render("index", {camps:camps});
});

app.get("/campgrounds-add", function(req, res){
    res.render("campgrounds-add");
});

app.listen(3000, function(){
    console.log("You have launched YelpCamp! Well done");
    console.log("Please go to url 'localhost:3000'");
});