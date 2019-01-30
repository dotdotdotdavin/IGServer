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







// extra.smembersAsync("archive").then(function(res){
//     console.log(res.length);
//     for(x=0;x<res.length;x++){
//         extra.hgetallAsync(res[x]).then(function(rep){
//            extra.hmsetAsync2(rep.name,"count",rep.count,
//                             "id",rep.id,
//                             "name",rep.name,
//                             "developer",rep.developer,
//                             "category",rep.category,
//                             "first_date",rep.first_date).then(function(reply){
//                                 console.log(reply);
//                             });
//        });
//     }
// });

// extra.smembersAsync("archive").then(function(res){
//     console.log(res.length);
//     for(x=0;x<res.length;x++){
//            extra.saddAsync2("archive",res[x]).then(function(rep){
//                console.log(rep);
//           });
//        }
//
// });


// extra.smembersAsync2("archive").then(function(res){
//     console.log(res.length);
//
//
// });

extra.hgetallAsync("2019-1-29").then(function(res){
    console.log(res);
//     // for(var i in res){
//     //     extra.hsetnxAsync2("2018-9-20",i,res[i]).then(function(res){
//     //
//     //     });
//     // }
});

//
// extra.delAsync("2019-1-30").then(function(res){
    // console.log(res);
    // process.exit(0);
// });


// extra.hgetallAsync("2018-9-30").then(function(res){
//     console.log(res);
// });

// extra.smembersAsync("archive").then(function(res){
//
//     for(var i in res){
//         console.log(res[i]);
//            extra.hlenAsync(res[i]).then(function(ress){
//                if(ress != 6){
//                    console.log(res[i]);
//                }
//            });
//        }
//
// });

// extra.smembersAsync("archive").then(function(res){
// //
//     for(var i in res){
//         console.log(res[i]);
//            extra.hgetAsync("2018-9-21",res[i]).then(function(ress){
//                    console.log(ress);
//
//            });
//        }
// //
// });
