const extra= require("./extra");

var count = 0;
var count2 = 0;

function getGameDates(){

    lw_date = getLastWeekDate();

    listDates= extra.smembersAsync("archive").then(function(ress){
        return ress;

    }).then(function(ress){
        list = []
        for(x = 0; x<ress.length; x++){
            if(ress[x] && ress[x] != undefined){

                list.push(retrieveAndInsert(ress[x],lw_date));
            }
        }

        return Promise.all(list).then(function(value){
            process.exit(0);
        });
    },lw_date);




}

function getWeeklyRating(listDates){

    lw_date = getLastWeekDate();

    for(x = 0; x<listDates.length;x++){
        if(listDates[x][1] != undefined){

            tempDate = new Date(listDates[x][1]);

            if(lw_date > tempDate){
                listDates[x][1] = lw_date;
            }
        }
    }



}

function retrieveAndInsert(title,lw_date){


    return extra.hgetallAsync(title).then(function(data){


        if(data.name != undefined && data){

         if(new Date(data.first_date) > new Date(lw_date)){
             lw_date = data.first_date;
         }

         count++;
         console.log(data.name);
         return extra.hgetAsync(lw_date,data.name).then(function(reply){
             if(reply){
                count--;
                return extra.hsetAsync(data.name,"last_week_count",reply).then(function(result){





                     return count;
                 });
             }

             else{
                 count--;
                 return false;
             }
         },lw_date,data);

        }

        else {
            return false;
        }


    });

}

function updateEntry(entry,lw_date){

    console.log(lw_date);

}

function getLastWeekDate(){
    var lw_date = new Date();
    lw_date.setDate(lw_date.getDate()-7);

    return lw_date.toLocaleDateString();
}

getGameDates();
