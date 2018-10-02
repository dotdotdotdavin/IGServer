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
    rawr = extra.smembersAsync("archive").then(function(ress){
        return ress;
    },res).then(function(ress){
        list2 = []
        list = [];
        for(x = 0; x<ress.length; x++){
            list2.push(extra.hgetallAsync(ress[x]).then(function(repl){
                    return repl;
                })
            );
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
    days = parseInt(days);
    if(name){
        extra.hgetallAsync(name).then(function(ress){
            list = []
            theDates = getDates(name,ress.first_date,days);
            for(x = 0; x<theDates.length; x++){
                curr = theDates[x];
                list.push(extra.hgetAsync(curr,name).then(function(repl){

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
                "last_week_count":ress.count,
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
    }
});

app.listen(port, '0.0.0.0', function() {
    console.log('Listening to port:  ' + port);
});

console.log('todo list RESTful API server started on: ' + port);

function getDates(name,fdate,many){

    fdate_array = fdate.split('-');
    for(x=0; x<3;x++){
        fdate_array[x]=parseInt(fdate_array[x]);
    }
    stop_date = new Date(fdate_array[0],fdate_array[1]-1,fdate_array[2]);
    dateArray = new Array();
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
