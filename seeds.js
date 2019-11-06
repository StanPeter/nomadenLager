var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");


var camps = [
    { name: "Norway-Fjord", image: "https://www.fjordnorway.com/imageresizer/?image=%2Fdbimgs%2Fsande-camping-turid-sande-beinnes.jpg&action=Background_Overlay", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam possimus odit optio a ipsum inventore facilis sequi nulla voluptates animi ratione, cum ea recusandae et hic, reprehenderit incidunt, iusto fuga quae ab. Quas, culpa assumenda at qui minus ipsum deleniti illo in sunt commodi saepe odit? Aliquid magnam eum quam vero nostrum nam esse hic facere ipsa. Maxime nemo inventore hic, natus delectus id beatae sunt cumque veritatis? Esse at fugiat dolorem nihil laborum voluptate ipsum ut error doloribus nesciunt eaque minima optio, soluta numquam! Molestiae non cumque ratione praesentium odio enim nemo molestias fugit expedita sequi, obcaecati qui temporibus." },
    { name: "Camping De Molignon", image: "https://static.alanrogers.com/images/generated/3d782eeb65eebd6b/CH9670-info-01_720_540_75_s_c1.jpg", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam possimus odit optio a ipsum inventore facilis sequi nulla voluptates animi ratione, cum ea recusandae et hic, reprehenderit incidunt, iusto fuga quae ab. Quas, culpa assumenda at qui minus ipsum deleniti illo in sunt commodi saepe odit? Aliquid magnam eum quam vero nostrum nam esse hic facere ipsa. Maxime nemo inventore hic, natus delectus id beatae sunt cumque veritatis? Esse at fugiat dolorem nihil laborum voluptate ipsum ut error doloribus nesciunt eaque minima optio, soluta numquam! Molestiae non cumque ratione praesentium odio enim nemo molestias fugit expedita sequi, obcaecati qui temporibus." },
    { name: "Peruvian Andes", image: "https://previews.123rf.com/images/belikova/belikova1802/belikova180200006/94623178-camping-in-the-peruvian-andes-salkantay-trekking-peru-.jpg", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam possimus odit optio a ipsum inventore facilis sequi nulla voluptates animi ratione, cum ea recusandae et hic, reprehenderit incidunt, iusto fuga quae ab. Quas, culpa assumenda at qui minus ipsum deleniti illo in sunt commodi saepe odit? Aliquid magnam eum quam vero nostrum nam esse hic facere ipsa. Maxime nemo inventore hic, natus delectus id beatae sunt cumque veritatis? Esse at fugiat dolorem nihil laborum voluptate ipsum ut error doloribus nesciunt eaque minima optio, soluta numquam! Molestiae non cumque ratione praesentium odio enim nemo molestias fugit expedita sequi, obcaecati qui temporibus." },
    { name: "Lagos de Somiedo", image: "https://about-spain.net/tourism/photos/camping-spain.jpg", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam possimus odit optio a ipsum inventore facilis sequi nulla voluptates animi ratione, cum ea recusandae et hic, reprehenderit incidunt, iusto fuga quae ab. Quas, culpa assumenda at qui minus ipsum deleniti illo in sunt commodi saepe odit? Aliquid magnam eum quam vero nostrum nam esse hic facere ipsa. Maxime nemo inventore hic, natus delectus id beatae sunt cumque veritatis? Esse at fugiat dolorem nihil laborum voluptate ipsum ut error doloribus nesciunt eaque minima optio, soluta numquam! Molestiae non cumque ratione praesentium odio enim nemo molestias fugit expedita sequi, obcaecati qui temporibus." },
    { name: "L'Amfora", image: "https://static.alanrogers.com/images/generated/f7814f82205277e5/ES80350-info-01_720_540_75_s_c1.jpg", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam possimus odit optio a ipsum inventore facilis sequi nulla voluptates animi ratione, cum ea recusandae et hic, reprehenderit incidunt, iusto fuga quae ab. Quas, culpa assumenda at qui minus ipsum deleniti illo in sunt commodi saepe odit? Aliquid magnam eum quam vero nostrum nam esse hic facere ipsa. Maxime nemo inventore hic, natus delectus id beatae sunt cumque veritatis? Esse at fugiat dolorem nihil laborum voluptate ipsum ut error doloribus nesciunt eaque minima optio, soluta numquam! Molestiae non cumque ratione praesentium odio enim nemo molestias fugit expedita sequi, obcaecati qui temporibus." },
    { name: "Norway-Fjord", image: "https://www.fjordnorway.com/imageresizer/?image=%2Fdbimgs%2Fsande-camping-turid-sande-beinnes.jpg&action=Background_Overlay", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam possimus odit optio a ipsum inventore facilis sequi nulla voluptates animi ratione, cum ea recusandae et hic, reprehenderit incidunt, iusto fuga quae ab. Quas, culpa assumenda at qui minus ipsum deleniti illo in sunt commodi saepe odit? Aliquid magnam eum quam vero nostrum nam esse hic facere ipsa. Maxime nemo inventore hic, natus delectus id beatae sunt cumque veritatis? Esse at fugiat dolorem nihil laborum voluptate ipsum ut error doloribus nesciunt eaque minima optio, soluta numquam! Molestiae non cumque ratione praesentium odio enim nemo molestias fugit expedita sequi, obcaecati qui temporibus. very cool camp" },
    { name: "Camping De Molignon", image: "https://static.alanrogers.com/images/generated/3d782eeb65eebd6b/CH9670-info-01_720_540_75_s_c1.jpg", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam possimus odit optio a ipsum inventore facilis sequi nulla voluptates animi ratione, cum ea recusandae et hic, reprehenderit incidunt, iusto fuga quae ab. Quas, culpa assumenda at qui minus ipsum deleniti illo in sunt commodi saepe odit? Aliquid magnam eum quam vero nostrum nam esse hic facere ipsa. Maxime nemo inventore hic, natus delectus id beatae sunt cumque veritatis? Esse at fugiat dolorem nihil laborum voluptate ipsum ut error doloribus nesciunt eaque minima optio, soluta numquam! Molestiae non cumque ratione praesentium odio enim nemo molestias fugit expedita sequi, obcaecati qui temporibus." }
]; 


async function seedDB() {
    try {
        // remove all camps and comments
        await Comment.remove({});
        await Campground.remove({});
        for (const camp of camps) {
            // create and push camps to DB + add a comment
            let campground = await Campground.create(camp);
            let comment = await Comment.create(
                {
                    author: "Homer",
                    text: "This place sucks"
                }
            )
            campground.comments.push(comment);
            campground.save();
        }
    } catch(err){
        console.log(err);
    }
}

// function seedDB(){
//     // remove all camps
//     Campground.remove({}, function(err){
//         if(err){
//             console.log(err);
//         } 
//         console.log("removed campgrounds");

//         // add new camps
//         camps.forEach(function (camp) {
//             Campground.create(camp, function (err, campground) {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     console.log("added camp");
//                     Comment.create(
//                         {   
//                             text: "Some random comment",
//                             author: "Homer"
//                     }, function(err, comment){
//                         if(err){
//                             console.log(err);
//                         } else{
//                             campground.comments.push(comment);
//                             campground.save();
//                             console.log("added comment");
//                         }
//                     });
//                 }
//             });
//         });
//     });
// }
    

module.exports = seedDB;