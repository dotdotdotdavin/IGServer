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





function f(){

    extra.smembersAsync("archive_id").then(function(res){
        // console.log(res);
        var tempList = [];


        for(let i = 0; i < res.length; i++){
            tempList.push(
                func1(res[i])
            );
        }


        return Promise.all(tempList).then(function(values){
            console.log(values.length);
            return values;
        });
    });

}

function func1(res){
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
    
}

// f();
