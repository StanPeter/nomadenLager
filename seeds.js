var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");


var camps = [
    { name: "Norway-Fjord", image: "https://www.fjordnorway.com/imageresizer/?image=%2Fdbimgs%2Fsande-camping-turid-sande-beinnes.jpg&action=Background_Overlay", description: "A very cool camp" },
    { name: "Camping De Molignon", image: "https://static.alanrogers.com/images/generated/3d782eeb65eebd6b/CH9670-info-01_720_540_75_s_c1.jpg", description: "A very cool camp" },
    { name: "Peruvian Andes", image: "https://previews.123rf.com/images/belikova/belikova1802/belikova180200006/94623178-camping-in-the-peruvian-andes-salkantay-trekking-peru-.jpg", description: "A very cool camp" },
    { name: "Lagos de Somiedo", image: "https://about-spain.net/tourism/photos/camping-spain.jpg", description: "A very cool camp" },
    { name: "L'Amfora", image: "https://static.alanrogers.com/images/generated/f7814f82205277e5/ES80350-info-01_720_540_75_s_c1.jpg", description: "A very cool camp" },
    { name: "Norway-Fjord", image: "https://www.fjordnorway.com/imageresizer/?image=%2Fdbimgs%2Fsande-camping-turid-sande-beinnes.jpg&action=Background_Overlay", description: "A very cool camp" },
    { name: "Camping De Molignon", image: "https://static.alanrogers.com/images/generated/3d782eeb65eebd6b/CH9670-info-01_720_540_75_s_c1.jpg", description: "A very cool camp" }
]; 


function seedDB(){
    // remove all camps
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        } 
        console.log("removed campgrounds");

        // add new camps
        camps.forEach(function (camp) {
            Campground.create(camp, function (err, campground) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("added camp");
                    Comment.create(
                        {   
                            text: "Some random comment",
                            author: "Homer"
                    }, function(err, comment){
                        if(err){
                            console.log(err);
                        } else{
                            campground.comments.push(comment);
                            campground.save();
                            console.log("added comment");
                        }
                    });
                }
            });
        });
    });
}
    

module.exports = seedDB;