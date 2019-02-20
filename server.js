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

app.get('/getday',(req,res) => {
    extra.hgetallAsync("trend >>> 2019-2-19").then(function(res1){
        // console.log(res1);

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
        console.log("return");
        return Promise.all(promise_list).then(function(res2){
            return obj;
        });
    }).then(function(resss){

        return res.json({
          msg: "These are to results for ",
          data: resss
        });
    },res);
});

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
