const extra= require("./extra");


function getGameDates(){

    lw_date = getLastWeekDate();

    listDates = extra.smembersAsync("archive").then(function(ress){
        return ress;

    }).then(function(ress){
        list = []
        for(x = 0; x<ress.length; x++){
            retrieveAndInsert(ress[x],lw_date);
        }


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

    extra.hgetallAsync(title).then(function(data){


        if(data.name != undefined && data){

         if(new Date(data.first_date) > new Date(lw_date)){
             lw_date = data.first_date;
         }


         extra.hgetAsync(lw_date,data.name).then(function(reply){
             if(reply){
                 console.log(data.name);
                 extra.hsetAsync(data.name,"last_week_count",reply).then(function(result){
                     console.log(result);
                 });
             }
         },lw_date,data);

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
