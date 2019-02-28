var extra = require('./extra');
var client2 = extra.client;
// var client = extra.client;
var async = require('async');
var dump = require('redis-dump');


// client.on('error',function(err){
//      console.log("Error " + err);
// });

client.on('error',function(err){
     console.log("Error " + err);
});





// function f(){
//
//     extra.smembersAsync("archive_id").then(function(res){
//         // console.log(res);
//         var tempList = [];
//
//
//         for(let i = 0; i < res.length; i++){
//             tempList.push(
//                 func1(res[i])
//             );
//         }
//
//
//         return Promise.all(tempList).then(function(values){
//             console.log(values.length);
//             return values;
//         });
//     });
//
// }
//
// function func1(res){
    // return extra.hgetAsync(res,"name").then(function(res1){
    //     if(res1){
    //         return extra.hgetallAsync(res1).then(function(res2){
    //             if(res2){
    //                 if(res == res2.id ){
    //                     console.log(res2);
    //                     return extra.hdelAsync(res2.id,"last_month_count")
    //                 }
    //                 else{
    //                     // console.log("NOT EQUAL: "+res+" "+res2.id+ " "+res1)
    //                 }
    //             }
    //             else{
    //                 return 0;
    //             }
    //         });
    //     }
    //     else {
    //         return 0;
    //     }
    // });

// }

// extra.delAsync("nt40161").then(function(ress){
//     console.log(ress);
// });
//

//DIDNT work out
// https://en2.nametests.com/test/what-are-the-5-best-things-about-you/40128/?start=1#
// extra.keysAsync("*").then(function(ress){
//     for (let i = 0; i<ress.length; i++){
//         if(ress[i].indexOf("bam >>>") == 0){
//             console.log(ress[i]);
//
//             // extra.hgetallAsync(ress[i]).then(function(res){
//             //     var link = "https://"+res.locale+".nametests.com/test/";
//             //     // let tempName = res.title.split("?").join("");
//             //     let tempName = res.title.toLowerCase();
//             //     tempName = tempName.split(" ").join("-");
//             //     link = link + tempName +"/"+res.id+"/";
//             //     console.log(link);
//             //     // console.log(res);
//             // });
//
//         }
//     }
// });



// f();

extra.hgetAsync("trend >>> 2019-2-27"
,"bam >>> 9:00"
// ,'40588|||40599|||40614|||40616|||40598'
).then(function(res){
    console.log(res);
});

//
//
// // function
//
// extra.hgetallAsync("nt >>> 40223").then(function(res1){
//     console.log(res1);
//     console.log(res1["NT_mid_appearances"]);
// });
