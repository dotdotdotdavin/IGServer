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
        // for(x = 0; x<ress.length; x++){
        //
        //     list2.push(extra.hgetallAsync(ress[x]).then(function(repl){
        //             return repl;
        //         })
        //     );
        // }

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
