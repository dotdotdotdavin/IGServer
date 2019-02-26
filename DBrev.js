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
//         if(ress[i].indexOf("nt >>>") == 0){
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

// extra.hgetallAsync("trend >>> 2019-2-20").then(function(res){
//     console.log(res);
// });
//
//
//
// // function
//
// extra.hgetallAsync("nt >>> 40223").then(function(res1){
//     console.log(res1);
//     console.log(res1["NT_mid_appearances"]);
// });


function faa(){
    var da = {};
    var da_keys = []
    return extra.hgetallAsync("trend >>> 2019-2-20").then(function(res1){
        for(var i = 0; i <= 23 ;i++){
            if(res1["NTtop >>> "+i+":00"] != undefined){

                var currTimeArray = res1["NTtop >>> "+i+":00"].split('|||');
                for(let ii = 0 ; ii < currTimeArray.length; ii++){
                    if(da[currTimeArray[ii]] == undefined){
                        da[currTimeArray[ii]] = {};
                        da[currTimeArray[ii]].count = 1;
                        da[currTimeArray[ii]].last_seen = "2019-2-20-"+i+":00";
                        da_keys.push(currTimeArray[ii]);
                    }

                    else{
                        da[currTimeArray[ii]].last_seen = "2019-2-20-"+i+":00";
                        da[currTimeArray[ii]].count = da[currTimeArray[ii]].count+1 ;
                    }
                }
            }
        }
        // console.log(da);

        return 1;
    }).then(function(res2){
        return extra.hgetallAsync("trend >>> 2019-2-21").then(function(res1){
            for(var i2 = 0; i2 <= 23 ;i2++){
                if(res1["NTtop >>> "+i2+":00"] != undefined){

                    var currTimeArray = res1["NTtop >>> "+i2+":00"].split('|||');
                    for(let ii2 = 0 ; ii2 < currTimeArray.length; ii2++){

                        if(da[currTimeArray[ii2]] == undefined){
                            da[currTimeArray[ii2]] = {};
                            da[currTimeArray[ii2]].count = 1;
                            da[currTimeArray[ii2]].last_seen = "2019-2-21-"+i2+":00";
                            da_keys.push(currTimeArray[ii2]);
                        }

                        else {

                            da[currTimeArray[ii2]].last_seen = "2019-2-21-"+i2+":00";
                            da[currTimeArray[ii2]].count = da[currTimeArray[ii2]].count+1 ;

                        }
                    }
                }
            }
            // console.log(da);


            return 1;
        });
    }).then(function(res3){
        var the_promise = [];


        for(let x = 0; x < da_keys.length; x++){
        
            var a = setSwitch(da_keys[x],da);

            the_promise.push(a);
        }

        return Promise.all(the_promise).then(function(val){
            console.log("done");
            return val;
        });
    });
}

function setSwitch(dakey,da){
    // console.log(da[dakey]["count"]);

    return extra.hmsetAsync("nt >>> "+dakey,
        'NT_top_appearances',da[dakey]["count"],
        'NT_top_last_seen',da[dakey]["last_seen"]).then(function(res7){
            return dakey;
        });
    return true;
}


function faaMID(){
    var da = {};
    var da_keys = []
    return extra.hgetallAsync("trend >>> 2019-2-20").then(function(res1){
        for(var i = 0; i <= 23 ;i++){
            if(res1["NTmid >>> "+i+":00"] != undefined){

                var currTimeArray = res1["NTmid >>> "+i+":00"].split('|||');
                for(let ii = 0 ; ii < currTimeArray.length; ii++){
                    if(da[currTimeArray[ii]] == undefined){
                        da[currTimeArray[ii]] = {};
                        da[currTimeArray[ii]].count = 1;
                        da[currTimeArray[ii]].last_seen = "2019-2-20-"+i+":00";
                        da_keys.push(currTimeArray[ii]);
                    }

                    else{
                        da[currTimeArray[ii]].last_seen = "2019-2-20-"+i+":00";
                        da[currTimeArray[ii]].count = da[currTimeArray[ii]].count+1 ;
                    }
                }
            }
        }
        // console.log(da);

        return 1;
    }).then(function(res2){
        return extra.hgetallAsync("trend >>> 2019-2-21").then(function(res1){
            for(var i2 = 0; i2 <= 23 ;i2++){
                if(res1["NTmid >>> "+i2+":00"] != undefined){

                    var currTimeArray = res1["NTmid >>> "+i2+":00"].split('|||');
                    for(let ii2 = 0 ; ii2 < currTimeArray.length; ii2++){
                        if(da[currTimeArray[ii2]] == undefined){
                            da[currTimeArray[ii2]] = {};
                            da[currTimeArray[ii2]].count = 1;
                            da[currTimeArray[ii2]].last_seen = "2019-2-21-"+i2+":00";
                            da_keys.push(currTimeArray[ii2]);
                        }

                        else{
                            da[currTimeArray[ii2]].last_seen = "2019-2-21-"+i2+":00";
                            da[currTimeArray[ii2]].count = da[currTimeArray[ii2]].count+1 ;
                        }
                    }
                }
            }
            // console.log(da);

            return 1;
        });
    }).then(function(res3){
        var the_promise = [];
        for(let x = 0; x < da_keys.length; x++){
            var a = setSwitchMID(da_keys[x],da);

            the_promise.push(a);
        }

        return Promise.all(the_promise).then(function(val){
            console.log("done mid");
            return val;
        });
    });
}

function setSwitchMID(dakey,da){
    // console.log(da[dakey]["count"]);
    return extra.hmsetAsync("nt >>> "+dakey,
        'NT_mid_appearances',da[dakey]["count"],
        'NT_mid_last_seen',da[dakey]["last_seen"]).then(function(res7){
            return dakey;
        });
    return true;
}

function faaWOW(){
    var da = {};
    var da_keys = []
    return extra.hgetallAsync("trend >>> 2019-2-20").then(function(res1){
        for(var i = 0; i <= 23 ;i++){
            if(res1["wow >>> "+i+":00"] != undefined){

                var currTimeArray = res1["wow >>> "+i+":00"].split('|||');
                for(let ii = 0 ; ii < currTimeArray.length; ii++){
                    if(da[currTimeArray[ii]] == undefined){
                        da[currTimeArray[ii]] = {};
                        da[currTimeArray[ii]].count = 1;
                        da[currTimeArray[ii]].last_seen = "2019-2-20-"+i+":00";
                        da_keys.push(currTimeArray[ii]);
                    }

                    else{
                        da[currTimeArray[ii]].last_seen = "2019-2-20-"+i+":00";
                        da[currTimeArray[ii]].count = da[currTimeArray[ii]].count+1 ;
                    }
                }
            }
        }
        // console.log(da);

        return 1;
    }).then(function(res2){
        return extra.hgetallAsync("trend >>> 2019-2-21").then(function(res1){
            for(var i2 = 0; i2 <= 23 ;i2++){
                if(res1["wow >>> "+i2+":00"] != undefined){

                    var currTimeArray = res1["wow >>> "+i2+":00"].split('|||');
                    for(let ii2 = 0 ; ii2 < currTimeArray.length; ii2++){
                        if(da[currTimeArray[ii2]] == undefined){
                            da[currTimeArray[ii2]] = {};
                            da[currTimeArray[ii2]].count = 1;
                            da[currTimeArray[ii2]].last_seen = "2019-2-21-"+i2+":00";
                            da_keys.push(currTimeArray[ii2]);
                        }

                        else{
                            da[currTimeArray[ii2]].last_seen = "2019-2-21-"+i2+":00";
                            da[currTimeArray[ii2]].count = da[currTimeArray[ii2]].count+1 ;
                        }
                    }
                }
            }
            // console.log(da);

            return 1;
        });
    }).then(function(res3){
        var the_promise = [];
        for(let x = 0; x < da_keys.length; x++){
            var a = setSwitchWOW(da_keys[x],da);

            the_promise.push(a);
        }

        return Promise.all(the_promise).then(function(val){
            console.log("done wow");
            return val;
        });
    });
}

function setSwitchWOW(dakey,da){
    // console.log(da[dakey]["count"]);
    return extra.hmsetAsync("nt >>> "+dakey,
        'reco_appearances',da[dakey]["count"],
        'last_seen',da[dakey]["last_seen"]).then(function(res7){
            return dakey;
        });
    return true;
}

faaWOW()
faaMID()
faa()
