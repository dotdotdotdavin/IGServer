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






extra.hgetallAsync("2018-12-6").then(function(res){
    console.log(res);
//     // for(var i in res){
//     //     extra.hsetnxAsync2("2018-9-20",i,res[i]).then(function(res){
//     //
//     //     });
//     // }
});

// extra.hgetallAsync("1/29/2019").then(function(res){
//     console.log(res);
// //     // for(var i in res){
// //     //     extra.hsetnxAsync2("2018-9-20",i,res[i]).then(function(res){
// //     //
// //     //     });
// //     // }
// });

// extra.saddAsync("archive_quiz_apps","474443516378085").then(function(res){
//
// });
//
// extra.saddAsync("archive_quiz_apps","455676461606571").then(function(res){
//
// });
//
// extra.saddAsync("archive_quiz_apps","2210323535904466").then(function(res){
//
// });
//
// extra.saddAsync("archive_quiz_apps","709002776145083").then(function(res){
//
// });
//
// extra.saddAsync("archive_quiz_apps","492432114586553").then(function(res){
//
// });
//
// extra.saddAsync("archive_quiz_apps","440945256433897").then(function(res){
//
// });

//2210323535904466
