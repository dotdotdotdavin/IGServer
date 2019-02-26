const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const cors = require('cors');

var list = new Array();

var extra = require('./extra');
var client = extra.client;

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());



// sample URL: http://localhost:5000/?game=Everwing
app.get('/', (req, res) => {
  let game = req.query.game;
  console.log('somebody visited');
  return res.json({
    msg: "These are to results for " + game,
    data: {
      game: game,
      mau: 69,
      users: 69,
    },
  });
});

app.get('/gettable', (req, res) => {
  let game = req.query.game;

    console.log("heyyy");
    rawr = extra.smembersAsync("archive_id").then(function(ress){
        return ress;
    },res).then(function(ress){
        list2 = []
        list = [];


        for(x = 0; x<ress.length; x++){
            list2.push(extra.hgetallAsync(ress[x]).then(function(repl){
                    // if(repl && repl.name){
                    //     return extra.existsAsync(repl.name).then(function(repl2){
                    //         if(repl2){
                    //             return extra.hgetallAsync(repl.name).then(function(repl3){
                    //                 if(repl3.first_date && repl3.first_date.indexOf('/') !== -1){
                    //
                    //                     let nowDate = repl3.first_date.split('/');
                    //                     let nowDateTemp = nowDate[0];
                    //                     nowDate[0] = nowDate[2];
                    //                     nowDate[2] = nowDate[1];
                    //                     nowDate[1] = nowDateTemp;
                    //                     repl3.first_date = nowDate.join('-');
                    //                 }
                    //                 // console.log("name");
                    //                 return repl3;
                    //             })
                    //
                    //         }
                    //         else {
                    //             if(repl.first_date && repl.first_date.indexOf('/') !== -1){
                    //                 let nowDate = repl.first_date.split('/');
                    //                 let nowDateTemp = nowDate[0];
                    //                 nowDate[0] = nowDate[2];
                    //                 nowDate[2] = nowDate[1];
                    //                 nowDate[1] = nowDateTemp;
                    //                 repl.first_date = nowDate.join('-');
                    //             }
                    //             // console.log("id");
                    //             return repl;
                    //         }
                    //     });
                    // }
                    if(repl && repl.id && repl.name){
                        if(repl.tag == undefined || repl.tag == 2){
                            repl.tag = 2;
                        }

                        if(repl.first_date && repl.first_date.indexOf('/') !== -1){
                                        let nowDate = repl.first_date.split('/');
                                        let nowDateTemp = nowDate[0];
                                        nowDate[0] = nowDate[2];
                                        nowDate[2] = nowDate[1];
                                        nowDate[1] = nowDateTemp;
                                        repl.first_date = nowDate.join('-');

                                    }
                        return repl;
                    }
                    else{
                        return null;
                    }
                })
            )
        }


        return Promise.all(list2).then(function(values){
            return values;
        });

    },res).then(function(ress){

        return res.json({
          msg: "These are to results for ",
          data: {
            array: ress
          }
        });
    },res);

});

app.get('/getgame', (req, res) => {
    let name = req.query.name;
    let days = req.query.days;
    let id = req.query.id;
    // console.log("here");
    days = parseInt(days);
    if(id && name){
        let ex = extra.existsAsync(id).then(function(res1){
                    return res1;
                }).then(function(res2){
                    if(res2 == 1){
                        var ind = id;
                    }
                    else {
                        var ind = name;
                    }




                return extra.hgetallAsync(ind).then(function(ress){
                    console.log(ress);
                    list = []

                    theDates = getDates(name,ress.first_date,days);
                    var curr;
                    var currDateTemp;
                    var oldcurr;
                    for(x = 0; x<theDates.length; x++){
                        curr = theDates[x];
                        oldcurr = curr;
                        curr = curr.split('/');
                        currDateTemp = curr[0];
                        curr[0] = curr[2];
                        curr[2] = curr[1];
                        curr[1] = currDateTemp;
                        curr = curr.join('-');
                        // console.log(oldcurr + " "+curr+" PREE");
                        currDateTemp = curr.split('-')

                        currDateTemp = new Date(currDateTemp[0],currDateTemp[1]-1,currDateTemp[2]);
                        let search = currDateTemp >= new Date(2019,0,30) ? id : name;

                        curr = currDateTemp < new Date(2019,0,30) && currDateTemp >= new Date(2018,11,7) ? oldcurr : curr;
                        list.push(extra.hgetAsync(curr,search).then(function(repl){
                                // console.log(repl);
                                return {"curr":repl};
                            })
                        );
                    }

                return Promise.all(list).then(function(values){
                    for(x = 0; x<theDates.length; x++){
                        buff = values[x].curr
                        values[x] = {[theDates[x]]:buff};
                    }

                    data = {
                        "id":ress.id,
                        "title":ress.name,
                        "developer":ress.developer,
                        "category":ress.category,
                        "first_date":ress.first_date,
                        "count":ress.count,
                        "last_week_count":ress.last_week_count,
                        "last_month_count":ress.last_month_count,
                        "icon":ress.icon,
                        "date_count":values
                    }

                    return data;
                },ress);

            }).then(function(resss){

                return res.json({
                  msg: "These are to results for ",
                  data: resss
                });
            },res,name);
        });
    }
});

app.get('/getdate',(req,res) => {
    var offset = parseInt(req.query.offset / -60);
    // var offset = 8;
    var date = req.query.date;
    var day = {};
    var day_other = {};
    var final_day = { 'NTtop':{},
        'NTmid': {},
        'wow': {},
        'wow-list':{},
        'nt-list':{}
    };
    return extra.hgetallAsync("trend >>> "+date).then(function(res1){
        // console.log(res1);
        if(res1){
            var obj = { 'NTtop':{},
                'NTmid': {},
                'wow': {},
                'wow-list':{},
                'nt-list':{}
            };

            var promise_list = [];

            for(let i = 0; i < 24; i++){

                let ia = makeQuizList(obj,i,'NTtop',res1);
                let ib = makeQuizList(obj,i,'NTmid',res1);
                let ic = makeQuizList(obj,i,'wow',res1);

                promise_list.push(ia);
                promise_list.push(ib);
                promise_list.push(ic);


            }
            // console.log("return");
            return Promise.all(promise_list).then(function(res2){
                day = obj;
                return obj;
            });
        }

        else{
            day = {};
            return {};
        }
    })
    .then(function(res2){

        var date_next;
        if(offset >= 0){
            date_next = getDayLess(date);
            date_next = date_next.split('-');
            date_next.pop();
            date_next = date_next.join('-');
        }
        else{
            date_next = getDayMore(date);
            date_next = date_next.split('-');
            date_next.pop();
            date_next = date_next.join('-');
        }

        return extra.hgetallAsync("trend >>> "+date_next).then(function(res1){
           // console.log(res1);
           if(res1){
               var obj = { 'NTtop':{},
                   'NTmid': {},
                   'wow': {},
                   'wow-list':{},
                   'nt-list':{}
               };

               var promise_list = [];

               for(let i = 0; i < 24; i++){

                   let ia = makeQuizList(obj,i,'NTtop',res1);
                   let ib = makeQuizList(obj,i,'NTmid',res1);
                   let ic = makeQuizList(obj,i,'wow',res1);

                   promise_list.push(ia);
                   promise_list.push(ib);
                   promise_list.push(ic);


               }
               // console.log("return");
               return Promise.all(promise_list).then(function(res2){
                   day_other = obj;
                   return day_other;
               });
           }

           else{
               day_other = {};
               return {};
           }
       });

    })
    .then(function(res3){
        if(offset >= 0){
            return adjustOnPlus(final_day,day,day_other,offset);
        }
        else{
            return adjustOnMinus(final_day,day,day_other,offset);
        }
    })
    .then(function(resss){
        return res.json({
          msg: "These are to results for ",
          data: resss
        });
    },res);
});

app.get('/getappearances', (req,res) => {
    var new_id = req.query.id+"";
    var new_txt = req.query.txt;

    var obj_appear = [];
    extra.hgetallAsync(new_txt+" >>> "+new_id).then(function(resss){
        if(resss){

            resss.appearList = {"wowAppear":[],
            "NT-top-Appear":[],
            "NT-mid-Appear":[]}
            if(new_txt == "wow"){
                return fetchAppearances(new_txt,resss,resss.last_seen,resss.reco_appearances,0,"");
            }
            else{
                console.log(resss);
                return fetchAppearances(new_txt,resss,resss['NT_top_last_seen'],parseInt(resss["NT_top_appearances"]),parseInt(resss["NT_mid_appearances"]),resss['NT_mid_last_seen']);
            }
        }
        else{
            return {};
        }
    }).then(function(resss){

        return res.json({
          msg: "These are to results for ",
          data: resss
        });
    },res);;


})

app.patch('/settag', (req, res) => {

    var get_id = req.body.params.id;
    var get_tag = parseInt(req.body.params.tag);
    // let get_id = req.query.id;
    // let get_tag = req.query.tag;

    if(get_id && (get_tag <= 2 && get_tag >= 0 )){
        return extra.hsetAsync(get_id,'tag',get_tag).then(function(rest){


                if(get_tag == 1){
                    return extra.saddAsync('archive_quiz_id',get_id).then(function(result1){
                        if(result1){
                            return result1
                        }

                        else {
                            return 5;
                        }

                    });
                }
                else {
                    return extra.sismemberAsync('archive_quiz_id',get_id).then(function(result1){

                        if (result1){
                            return extra.sremAsync('archive_quiz_id',get_id).then(function(result3){

                                return result3;
                            });
                        }

                        else{

                            return 1;
                        }
                    });
                }


        }).then(function(result2){

            if(result2 == 1){
                return res.json({
                    msg:"Saved",
                    data:{id:get_id,tag:get_tag}
                });
            }

            else if (result2 == 0){
                return res.json({
                    msg:"Not Saved",
                    data:{id:get_id,tag:get_tag}
                });
            }
            else if (result2 == 5){
                return res.json({
                    msg:"Already in the list, not Saved",
                    data:{id:get_id,tag:get_tag}
                });
            }
        });
    }

    else{
        return res.json({
            msg:"Invalid Params",
            data:{id:get_id,tag:get_tag}
        });
    }


});

app.listen(port, '0.0.0.0', function() {
    console.log('Listening to port:  ' + port);
});


console.log('todo list RESTful API server started on: ' + port);

function fetchAppearances(txt,ress,rLastSeen, appear1, appear2,mLastSeen){

    if(txt == 'wow'){
        if(appear1 <= 0){
            // console.log("end");
            return ress;
        }
        else{

            rLastSeen = rLastSeen.split('-');
            let rLastTime = rLastSeen.pop();
            rLastTime = rLastTime.split(':');
            rLastTime = parseInt(rLastTime[0]);
            rLastSeen = rLastSeen.join('-');
            return extra.hgetallAsync("trend >>> "+rLastSeen).then(function(res1){
                var tempList = {date:rLastSeen,hours:[]};
                for(let i = rLastTime; i >= 0; i--){
                    if(res1[txt+" >>> "+i+":00"] != undefined){
                        let timeList = res1[txt+" >>> "+i+":00"].split("|||");
                        if(timeList.includes(ress.id)){
                            tempList.hours.push(i)
                            appear1--;
                        }

                        if(appear1 == 0){
                            break;
                        }
                    }
                }

                return tempList;
            }).then(function(tempList){
                if(tempList.hours.length > 0){
                    ress.appearList.wowAppear.push(tempList);
                }
                if(appear1 != 0){
                    rLastSeen = getDayLess(rLastSeen);
                    return fetchAppearances(txt,ress,rLastSeen,appear1,appear2,mLastSeen);
                }
                else{
                    return ress;
                }

            });

        }
    }

    else{
        if(appear1 <= 0 && appear2 <= 0){
            // console.log("end");
            return ress;
        }

        else if (appear1 > 0) {
            rLastSeen = rLastSeen.split('-');
            let rLastTime = rLastSeen.pop();
            rLastTime = rLastTime.split(':');
            rLastTime = parseInt(rLastTime[0]);
            rLastSeen = rLastSeen.join('-');
            return extra.hgetallAsync("trend >>> "+rLastSeen).then(function(res1){
                var tempList = {date:rLastSeen,hours:[]};
                for(let i = rLastTime; i >= 0; i--){
                    if(res1["NTtop >>> "+i+":00"] != undefined){
                        let timeList = res1["NTtop >>> "+i+":00"].split("|||");
                        if(timeList.includes(ress.id)){
                            tempList.hours.push(i)
                            appear1--;
                        }

                        if(appear1 == 0){
                            break;
                        }
                    }
                }

                return tempList;
            }).then(function(tempList){
                if(tempList.hours.length > 0){
                    ress.appearList["NT-top-Appear"].push(tempList);
                }

                rLastSeen = getDayLess(rLastSeen);
                return fetchAppearances(txt,ress,rLastSeen,appear1,appear2,mLastSeen);

            });
        }

        else if (appear2 > 0) {
            // console.log(ress);
            mLastSeen = mLastSeen.split('-');
            let mLastTime = mLastSeen.pop();
            mLastTime = mLastTime.split(':');
            mLastTime = parseInt(mLastTime[0]);
            mLastSeen = mLastSeen.join('-');
            return extra.hgetallAsync("trend >>> "+mLastSeen).then(function(res1){
                var tempList = {date:mLastSeen,hours:[]};
                for(let i = mLastTime; i >= 0; i--){
                    if(res1["NTmid >>> "+i+":00"] != undefined){
                        let timeList = res1["NTmid >>> "+i+":00"].split("|||");
                        if(timeList.includes(ress.id)){
                            tempList.hours.push(i)
                            appear2--;
                        }

                        if(appear2 == 0){
                            break;
                        }
                    }
                }

                return tempList;
            }).then(function(tempList){
                if(tempList.hours.length > 0){
                    ress.appearList["NT-mid-Appear"].push(tempList);
                }

                mLastSeen = getDayLess(mLastSeen);
                return fetchAppearances(txt,ress,rLastSeen,appear1,appear2,mLastSeen);

            });
        }
    }


}

function getDayLess(last){
    // console.log(last);
    last = last.split("-");
    let new_last = new Date(last[0],last[1]-1,last[2]);
    // console.log(last);
    new_last.setDate(new_last.getDate() - 1);
    let new_last_string = new_last.toLocaleDateString();
    new_last_string = new_last_string.split('/');
    new_last = new_last_string[0];
    new_last_string[0] = new_last_string[2];
    new_last_string[2] = new_last_string[1];
    new_last_string[1] = new_last;
    new_last_string = new_last_string.join('-');
    new_last_string= new_last_string+"-23:00";
    return new_last_string;

}

function getDayMore(last){
    // console.log(last);
    last = last.split("-");
    let new_last = new Date(last[0],last[1]-1,last[2]);
    // console.log(last);
    new_last.setDate(new_last.getDate() + 1);
    let new_last_string = new_last.toLocaleDateString();
    new_last_string = new_last_string.split('/');
    new_last = new_last_string[0];
    new_last_string[0] = new_last_string[2];
    new_last_string[2] = new_last_string[1];
    new_last_string[1] = new_last;
    new_last_string = new_last_string.join('-');
    new_last_string= new_last_string+"-23:00";
    return new_last_string;

}

function getDates(name,fdate,many){

    var fdate_array;
    var dateArray;
    var currentDate;

    if(fdate.indexOf('/') !== -1){
        fdate_array = fdate.split('/');
        for(x=0; x<3;x++){
            fdate_array[x]=parseInt(fdate_array[x]);
        }
        stop_date = new Date(fdate_array[2],fdate_array[0]-1,fdate_array[1] );
        dateArray = new Array();
    }

    else if (fdate.indexOf('-') !== -1){
        fdate_array = fdate.split('-');
        for(x=0; x<3;x++){
            fdate_array[x]=parseInt(fdate_array[x]);
        }
        stop_date = new Date(fdate_array[0],fdate_array[1]-1,fdate_array[2] );
        dateArray = new Array();
    }
    currentDate = new Date();


    if(many == -1){
        while(currentDate >= stop_date){
            dateArray.unshift(new Date(currentDate).toLocaleDateString());
            currentDate = currentDate.addDays(-1);
        }
    }

    else{
        ctr = 0;
        while(ctr < many && currentDate >= stop_date){
            ctr++;
            dateArray.unshift(new Date(currentDate).toLocaleDateString());
            currentDate = currentDate.addDays(-1);
        }
    }


    return dateArray;

}

function makeQuizList(obj,index,txt,res1){
    let iHour = index+':00';
    var promise_list = [];
    if(res1[txt+" >>> "+iHour]){
        obj[txt][iHour]=res1[txt+" >>> "+iHour].split('|||');
        for(let i = 0; i < obj[txt][iHour].length; i++){
            let new_txt = txt == 'wow' ? "wow" : "nt"
            let a = retriveQuiz(obj,obj[txt][iHour][i],new_txt);

            promise_list.push(a);
        }

        return Promise.all(promise_list).then(function(res2){
            return true;
        });
    }

    else{
        return true;
    }
}

function retriveQuiz(obj,id,txt){
    if(!obj[txt+'-list'][id]){
        return extra.hgetallAsync(txt+' >>> '+id).then(function(res){
            obj[txt+'-list'][id] = res;
            return true;
        });
    }
}

function adjustOnPlus(final_day,day,day_other,offset){

    for(let i = 0; i <= 23 - offset; i++){

        if(day["NTtop"] != undefined &&
        day["NTtop"][i+':00'] != undefined){

            final_day["NTtop"][(i+offset)+':00'] = day["NTtop"][i+':00'];

            for(let ii = 0; ii < day["NTtop"][i+':00'].length; ii++){
                if(final_day["nt-list"][day["NTtop"][i+':00'][ii]] == undefined ||
                final_day["nt-list"][day["NTtop"][i+':00'][ii]] == null){
                    final_day["nt-list"][day["NTtop"][i+':00'][ii]] = day["nt-list"][day["NTtop"][i+':00'][ii]];
                }
            }
        }

        if(day["NTmid"] != undefined &&
        day["NTmid"][i+':00'] != undefined){

            final_day["NTmid"][(i+offset)+':00'] = day["NTmid"][i+':00'];

            for(let ii = 0; ii < day["NTmid"][i+':00'].length; ii++){
                if(final_day["nt-list"][day["NTmid"][i+':00'][ii]] == undefined ||
                final_day["nt-list"][day["NTmid"][i+':00'][ii]] == null){
                    final_day["nt-list"][day["NTmid"][i+':00'][ii]] = day["nt-list"][day["NTmid"][i+':00'][ii]];
                }
            }
        }

        if(day["wow"] != undefined &&
        day["wow"][i+':00'] != undefined){

            final_day["wow"][(i+offset)+':00'] = day["wow"][i+':00'];

            for(let ii = 0; ii < day["wow"][i+':00'].length; ii++){
                if(final_day["wow-list"][day["wow"][i+':00'][ii]] == undefined ||
                final_day["wow-list"][day["wow"][i+':00'][ii]] == null){
                    final_day["wow-list"][day["wow"][i+':00'][ii]] = day["wow-list"][day["wow"][i+':00'][ii]];
                }
            }
        }

    }

    for(let i = 24 - offset; i <= 23; i++){

        let offs = i+offset-24;
        if(day_other["NTtop"] != undefined &&
        day_other["NTtop"][i+':00'] != undefined){
            final_day["NTtop"][(offs)+':00'] = day_other["NTtop"][i+':00'];

            for(let ii = 0; ii < day_other["NTtop"][i+':00'].length; ii++){
                if(final_day["nt-list"][day_other["NTtop"][i+':00'][ii]] == undefined ||
                final_day["nt-list"][day_other["NTtop"][i+':00'][ii]] == null){
                    final_day["nt-list"][day_other["NTtop"][i+':00'][ii]] = day_other["nt-list"][day_other["NTtop"][i+':00'][ii]];
                }
            }
        }

        if(day_other["NTmid"] != undefined &&
        day_other["NTmid"][i+':00'] != undefined){

            final_day["NTmid"][offs+':00'] = day_other["NTmid"][i+':00'];

            for(let ii = 0; ii < day_other["NTmid"][i+':00'].length; ii++){
                if(final_day["nt-list"][day_other["NTmid"][i+':00'][ii]] == undefined ||
                final_day["nt-list"][day_other["NTmid"][i+':00'][ii]] == null){
                    final_day["nt-list"][day_other["NTmid"][i+':00'][ii]] = day_other["nt-list"][day_other["NTmid"][i+':00'][ii]];
                }
            }
        }

        if(day_other["wow"] != undefined &&
        day_other["wow"][i+':00'] != undefined){

            final_day["wow"][offs+':00'] = day_other["wow"][i+':00'];

            for(let ii = 0; ii < day_other["wow"][i+':00'].length; ii++){
                if(final_day["wow-list"][day_other["wow"][i+':00'][ii]] == undefined ||
                final_day["wow-list"][day_other["wow"][i+':00'][ii]] == null){
                    final_day["wow-list"][day_other["wow"][i+':00'][ii]] = day_other["wow-list"][day_other["wow"][i+':00'][ii]];
                }
            }
        }

    }

    return final_day;
}

function adjustOnMinus(final_day,day,day_other,offset){
    offset = offset * -1;
    for(let i = 0 + offset; i <= 23; i++){
        // console.log(i);
        if(day["NTtop"] != undefined &&
        day["NTtop"][i+':00'] != undefined){

            final_day["NTtop"][(i-offset)+':00'] = day["NTtop"][i+':00'];

            for(let ii = 0; ii < day["NTtop"][i+':00'].length; ii++){
                if(final_day["nt-list"][day["NTtop"][i+':00'][ii]] == undefined ||
                final_day["nt-list"][day["NTtop"][i+':00'][ii]] == null){
                    final_day["nt-list"][day["NTtop"][i+':00'][ii]] = day["nt-list"][day["NTtop"][i+':00'][ii]];
                }
            }
        }

        if(day["NTmid"] != undefined &&
        day["NTmid"][i+':00'] != undefined){

            final_day["NTmid"][(i-offset)+':00'] = day["NTmid"][i+':00'];

            for(let ii = 0; ii < day["NTmid"][i+':00'].length; ii++){
                if(final_day["nt-list"][day["NTmid"][i+':00'][ii]] == undefined ||
                final_day["nt-list"][day["NTmid"][i+':00'][ii]] == null){
                    final_day["nt-list"][day["NTmid"][i+':00'][ii]] = day["nt-list"][day["NTmid"][i+':00'][ii]];
                }
            }
        }

        if(day["wow"] != undefined &&
        day["wow"][i+':00'] != undefined){

            final_day["wow"][(i-offset)+':00'] = day["wow"][i+':00'];

            for(let ii = 0; ii < day["wow"][i+':00'].length; ii++){
                if(final_day["wow-list"][day["wow"][i+':00'][ii]] == undefined ||
                final_day["wow-list"][day["wow"][i+':00'][ii]] == null){
                    final_day["wow-list"][day["wow"][i+':00'][ii]] = day["wow-list"][day["wow"][i+':00'][ii]];
                }
            }
        }

    }
    // console.log("switch");
    for(let i = 0; i < offset; i++){
        // console.log(i);
        let offs = i-8+24;
        if(day_other["NTtop"] != undefined &&
        day_other["NTtop"][i+':00'] != undefined){
            final_day["NTtop"][(offs)+':00'] = day_other["NTtop"][i+':00'];

            for(let ii = 0; ii < day_other["NTtop"][i+':00'].length; ii++){
                if(final_day["nt-list"][day_other["NTtop"][i+':00'][ii]] == undefined ||
                final_day["nt-list"][day_other["NTtop"][i+':00'][ii]] == null){
                    final_day["nt-list"][day_other["NTtop"][i+':00'][ii]] = day_other["nt-list"][day_other["NTtop"][i+':00'][ii]];
                }
            }
        }

        if(day_other["NTmid"] != undefined &&
        day_other["NTmid"][i+':00'] != undefined){

            final_day["NTmid"][offs+':00'] = day_other["NTmid"][i+':00'];

            for(let ii = 0; ii < day_other["NTmid"][i+':00'].length; ii++){
                if(final_day["nt-list"][day_other["NTmid"][i+':00'][ii]] == undefined ||
                final_day["nt-list"][day_other["NTmid"][i+':00'][ii]] == null){
                    final_day["nt-list"][day_other["NTmid"][i+':00'][ii]] = day_other["nt-list"][day_other["NTmid"][i+':00'][ii]];
                }
            }
        }

        if(day_other["wow"] != undefined &&
        day_other["wow"][i+':00'] != undefined){

            final_day["wow"][offs+':00'] = day_other["wow"][i+':00'];

            for(let ii = 0; ii < day_other["wow"][i+':00'].length; ii++){
                if(final_day["wow-list"][day_other["wow"][i+':00'][ii]] == undefined ||
                final_day["wow-list"][day_other["wow"][i+':00'][ii]] == null){
                    final_day["wow-list"][day_other["wow"][i+':00'][ii]] = day_other["wow-list"][day_other["wow"][i+':00'][ii]];
                }
            }
        }

    }

    return final_day;
}
