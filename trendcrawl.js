const login_page_fb = 'https://facebook.com/login/';
const instant_games_fb = 'https://facebook.com/instantgames/';
const puppeteer = require('puppeteer');
const fs = require('fs');
const EMAIL_SELECTOR = '#email';
const PASSWORD_SELECTOR = '#pass';
const LOG_IN_BUTTON = '#loginbutton';
const extra= require("./extra");
const NTtop_API = "https://static.social-api.me/exports/buffer/json/instant-game-nt-multi-startpage-top-language-json-english.json";
const NTmid_API = "https://static.social-api.me/exports/buffer/json/instant-game-nt-multi-startpage-middle-language-json-english.json";
const wowAPI = "https://api.wowwquiz.com/v2/quiz_recommend_list.php?page=0&size=20&lang=en";
const bamAPI = "https://www.bamapp.info/api/quizzes/list?gender=none&locale=en";
const finishUP = [1,1,1,0];


async function trendcrawl(){
    browser = await puppeteer.launch({
      headless: true,
      args: ['--disable-notifications','--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();


    page.on('response', async response => {
      if(response.url().indexOf("instant-game-nt-multi-startpage-top-language-json-english") != -1){
         console.log("Received Quiz");

         var topList = response.json().then(function(something){

             shipment = [];

             collectDataNTtop(something).then(function(res){
                 trendNTmid(page);
             });



         });

        }

        else if (response.url().indexOf("instant-game-nt-multi-startpage-middle-language-json-english") != -1) {
           var midList = response.json().then(function(something){

               shipment = [];
               // console.log(something);
               collectDataNTmid(something).then(function(res){
                  trendWOW(page);
               });

           });
        }

        else if (response.url().indexOf("quiz_recommend_list") != -1 &&
            response.url().indexOf("api.wowwquiz") != -1) {
           var wowList = response.json().then(function(something){

               shipment = [];
               // console.log(something);
               collectDataWow(something).then(function(res){
                   trendBAM(page);
               });

           });
        }

        else if (response.url().indexOf("https://www.bamapp.info/api/quizzes/") != -1) {
           var bamList = response.json().then(function(something){

               shipment = [];
               // console.log(something);
               collectDataBam(something).then(function(res){
                   endTheCode(3,browser);
               });

           });
        }

    });


    trendNTtop(page);
    // trendBAM(page);
    // trendNTmid(page1);
    // trendWOW(page2);

}

async function endTheCode(index,browser){
    finishUP[index] = 1;

    if(!finishUP.includes(0)){
        console.log("Closing");
        browser.close();
        process.exit(0);
    };
}

async function trendNTtop(page){
    await page.goto(NTtop_API);
}
async function trendNTmid(page1){
    await page1.goto(NTmid_API);
}
async function trendWOW(page2){
    await page2.goto(wowAPI);
}

async function trendBAM(page2){
    await page2.goto(bamAPI);
}

async function collectDataNTtop(something){
    var aDate = new Date();
    aDate = new Date(aDate.getUTCFullYear(),aDate.getUTCMonth(),aDate.getUTCDate(),aDate.getUTCHours());
    var nowDate = dateTranslate(aDate);
    var on_temp = [];

    var listInString="";

    for(let x = 0; x < something.items.length; x++){
        listInString = x == 0 ? listInString + something.items[x].id : listInString + "|||" + something.items[x].id;
        let a = createARecordNT(something.items[x],"nt",nowDate,aDate,'top');
        // a = true;
        on_temp.push(a);
    }

    return Promise.all(on_temp).then(function(val) {
        var trendHash = "trend >>> "+nowDate;
        var currDate = new Date();
        console.log(aDate);
        var trendKey = "NTtop >>> "+aDate.getHours()+":"+"00";
        return extra.hexistsAsync(trendHash,trendKey).then(function(res){
            if (res == 1){
                return extra.hgetAsync(trendHash,trendKey).then(function(res1){
                    var tempListString = listInString.split("|||");
                    var tempres1 = res1.split("|||");
                    console.log(tempres1.length);
                    console.log(tempres1);
                    for(let iii = 0; iii < tempListString.length; iii++){
                        if( !tempres1.includes(tempListString[iii]) ){
                            // console.log(tempres1);
                            console.log("Not Exist");
                            console.log(tempListString[iii]);
                            tempres1.push(tempListString[iii]);
                        }
                    }
                    console.log(tempres1.length);
                    console.log(tempres1);
                    tempres1 = tempres1.join('|||');

                    return extra.hsetAsync(trendHash,trendKey,tempres1).then(function(res1){
                        console.log(trendHash);
                        console.log(trendKey);
                        console.log("Update Done Data Top");
                        return res1;
                    });

                });
            }
            else{
                return extra.hsetAsync(trendHash,trendKey,listInString).then(function(res1){
                    console.log(trendHash);
                    console.log(trendKey);
                    console.log("Done Data Top");
                    return res1;
                });
            }
        });
    });
}

async function collectDataNTmid(something){
    var aDate = new Date();
    aDate = new Date(aDate.getUTCFullYear(),aDate.getUTCMonth(),aDate.getUTCDate(),aDate.getUTCHours());
    var nowDate = dateTranslate(aDate);

    var on_temp = [];

    var listInString="";

    for(let x = 0; x < something.items.length; x++){
        listInString = x == 0 ? listInString + something.items[x].id : listInString + "|||" + something.items[x].id;
        let a = createARecordNT(something.items[x],"nt",nowDate,aDate,'mid')

        on_temp.push(a);
    }

    return Promise.all(on_temp).then(function(val) {
        var trendHash = "trend >>> "+nowDate;
        var currDate = new Date();
        var trendKey = "NTmid >>> "+aDate.getHours()+":"+"00";


        return extra.hexistsAsync(trendHash,trendKey).then(function(res){
            if (res == 1){
                return extra.hgetAsync(trendHash,trendKey).then(function(res1){
                    var tempListString = listInString.split("|||");
                    var tempres1 = res1.split("|||");
                    console.log(tempres1.length);
                    console.log(tempres1);
                    for(let iii = 0; iii < tempListString.length; iii++){
                        if( !tempres1.includes(tempListString[iii]) ){
                            // console.log(tempres1);
                            console.log("Not Exist");
                            console.log(tempListString[iii]);
                            tempres1.push(tempListString[iii]);
                        }
                    }
                    console.log(tempres1.length);
                    console.log(tempres1);
                    tempres1 = tempres1.join('|||');

                    return extra.hsetAsync(trendHash,trendKey,tempres1).then(function(res1){
                        console.log(trendHash);
                        console.log(trendKey);
                        console.log("Update Done Data Mid");
                        return res1;
                    });

                });
            }
            else{
                return extra.hsetAsync(trendHash,trendKey,listInString).then(function(res1){
                    console.log(trendHash);
                    console.log(trendKey);
                    console.log("Done Data Mid");
                    return res1;
                });
            }
        });
    });
}

async function collectDataWow(something){
    var aDate = new Date();
    aDate = new Date(aDate.getUTCFullYear(),aDate.getUTCMonth(),aDate.getUTCDate(),aDate.getUTCHours());
    var nowDate = dateTranslate(aDate);

    var on_temp = [];

    var listInString="";

    for(let x = 0; x < something.data.length; x++){
        listInString = x == 0 ? listInString + something.data[x].id : listInString + "|||" + something.data[x].id;
        let a = createARecordWow(something.data[x],nowDate,aDate);

        on_temp.push(a);
    }

    return Promise.all(on_temp).then(function(val) {
        var trendHash = "trend >>> "+nowDate;
        var currDate = new Date();
        var trendKey = "wow >>> "+aDate.getHours()+":"+"00";
        return extra.hexistsAsync(trendHash,trendKey).then(function(res){
            if (res == 1){
                return extra.hgetAsync(trendHash,trendKey).then(function(res1){
                    var tempListString = listInString.split("|||");
                    var tempres1 = res1.split("|||");
                    console.log(tempres1.length);
                    console.log(tempres1);
                    for(let iii = 0; iii < tempListString.length; iii++){
                        if( !tempres1.includes(tempListString[iii]) ){
                            // console.log(tempres1);
                            console.log("Not Exist");
                            console.log(tempListString[iii]);
                            tempres1.push(tempListString[iii]);
                        }
                    }
                    console.log(tempres1.length);
                    console.log(tempres1);
                    tempres1 = tempres1.join('|||');

                    return extra.hsetAsync(trendHash,trendKey,tempres1).then(function(res1){
                        console.log(trendHash);
                        console.log(trendKey);
                        console.log("Update Done Data wow");
                        return res1;
                    });

                });
            }
            else{
                return extra.hsetAsync(trendHash,trendKey,listInString).then(function(res1){
                    console.log(trendHash);
                    console.log(trendKey);
                    console.log("Done Data wow");
                    return res1;
                });
            }

        });
    });

    // console.log(listInString);
}

async function collectDataBam(something){
    var aDate = new Date();
    aDate = new Date(aDate.getUTCFullYear(),aDate.getUTCMonth(),aDate.getUTCDate(),aDate.getUTCHours());
    var nowDate = dateTranslate(aDate);

    var on_temp = [];

    var listInString="";

    var x = 0;
    var xx = 0;

    console.log(something.male.length);
    console.log(something.female.length);
    console.log(something.none.length);
    console.log("|||");
    for(let x = 0; x < something.none.length; x++){
        listInString = x == 0 ? listInString + something.none[x].id : listInString + "|||" + something.none[x].id;
        let a = createARecordBam(something.none[x],nowDate,aDate);
        on_temp.push(a);
    }

    console.log(listInString.split("|||").length);

    for(let x = 0; x < something.male.length; x++){
        if(listInString.indexOf(something.male[x].id) == -1){
            console.log("Unique");
            listInString = listInString.length <= 0 ? listInString + something.male[x].id : listInString + "|||" + something.male[x].id;
            let a = createARecordBam(something.male[x],nowDate,aDate);
            on_temp.push(a);
        }
    }

    console.log(listInString.split("|||").length);

    for(let x = 0; x < something.female.length; x++){
        if(listInString.indexOf(something.female[x].id) == -1){
            console.log("Special");
            listInString = listInString.length <= 0 ? listInString + something.female[x].id : listInString + "|||" + something.female[x].id;
            let a = createARecordBam(something.female[x],nowDate,aDate);
            on_temp.push(a);
        }
    }

    console.log(listInString.split("|||").length);

    return Promise.all(on_temp).then(function(val){
        var trendHash = "trend >>> "+nowDate;
        var currDate = new Date();
        var trendKey = "bam >>> "+aDate.getHours()+":"+"00";

        return extra.hexistsAsync(trendHash,trendKey).then(function(res){

            if (res == 1){
                return extra.hgetAsync(trendHash,trendKey).then(function(res1){
                    var tempListString = listInString.split("|||");
                    var tempres1 = res1.split("|||");
                    // console.log(tempres1.length);
                    // console.log(tempres1);
                    for(let iii = 0; iii < tempListString.length; iii++){
                        if( !tempres1.includes(tempListString[iii]) ){
                            // console.log(tempres1);
                            console.log("Not Exist");
                            console.log(tempListString[iii]);
                            tempres1.push(tempListString[iii]);
                        }
                    }
                    // console.log(tempres1.length);
                    // console.log(tempres1);
                    tempres1 = tempres1.join('|||');

                    return extra.hsetAsync(trendHash,trendKey,tempres1).then(function(res1){
                        console.log(trendHash);
                        console.log(trendKey);
                        console.log("Update Done Data bam");
                        return res1;
                    });

                });
            }
            else{
                return extra.hsetAsync(trendHash,trendKey,listInString).then(function(res1){
                    console.log(trendHash);
                    console.log(trendKey);
                    console.log("Done Data bam");
                    return res1;
                });
            }

        });

    });

    // console.log(Object.keys(something.none[0]));

    // console.log(listInString);
}

function createARecordNT(payload,site,nowDate,aDate,txt){

    var tempKey = site+" >>> "+payload.id;
    if(txt == 'top'){
        var isOne = 'NT_top_appearances';
        var isZero = 'NT_mid_appearances';
        var isOneDate = 'NT_top_last_seen';
        var isZeroDate = 'NT_mid_last_seen';
    }
    else{
        var isZero = 'NT_top_appearances';
        var isOne = 'NT_mid_appearances';
        var isOneDate = 'NT_mid_last_seen';
        var isZeroDate = 'NT_top_last_seen';
    }

    var last_seen = nowDate+"-"+aDate.getHours()+":00";
    return extra.existsAsync(tempKey).then(function(res){

        if (res == 0){
            console.log(tempKey);
            return extra.hmsetAsync(tempKey,
                        "id",payload.id,
                        "title",payload.title,
                        "description",payload.description,
                        "quiz_subtype",payload.quiz_subtype,
                        "created",payload.created,
                        "updated",payload.updated,
                        "promote_image",payload.promote_image,
                        "quiz_type",payload.quiz_type,
                        "locale",payload.locale,
                        isOne,1,isZero,0,isOneDate,last_seen,isZeroDate,0).then(function(res){
                            return extra.saddAsync("archive_id_nt",payload.id).then(function(res1){
                                return res;
                            });
                        });
        }
        else{
            return extra.hgetallAsync(tempKey).then(function(res1){
                var verdict = false;

                if(txt == 'top'){
                    var isCurr = res1['NT_top_appearances'];
                    var isCurrDate = res1['NT_top_last_seen'];
                    var isKey = 'NT_top_appearances';
                    var isKeyDate = 'NT_top_last_seen';
                }
                else{
                    var isCurr = res1['NT_mid_appearances'];
                    var isCurrDate = res1['NT_mid_last_seen'];
                    var isKey = 'NT_mid_appearances';
                    var isKeyDate = 'NT_mid_last_seen';
                }

                if(isCurrDate != 0 && isCurrDate != undefined && isCurrDate != "0"){
                    isCurrDate = isCurrDate.split("-");
                    isCurrDate[3] = isCurrDate[3].split(':');
                    isCurrDate = new Date(parseInt(isCurrDate[0]),parseInt(isCurrDate[1])-1,parseInt(isCurrDate[2]),parseInt(isCurrDate[3][0]));
                    var temp_last_seen = last_seen.split("-");
                    temp_last_seen[3] = temp_last_seen[3].split(':');
                    temp_last_seen = new Date(parseInt(temp_last_seen[0]),parseInt(temp_last_seen[1])-1,parseInt(temp_last_seen[2]),parseInt(temp_last_seen[3][0]));
                    verdict = temp_last_seen > isCurrDate ? true:false;

                }
                else{
                    verdict = true;
                }

                if(verdict == true){
                    var isAmount = isCurr == undefined ? 1 : parseInt(isCurr) + 1;
                    return extra.hmsetAsync(tempKey,isKey,isAmount,isKeyDate,last_seen).then(function(res2){
                            return res2;
                    })
                }
                else{
                    return 1;
                }
            });
        }
    });

}

function createARecordWow(payload,nowDate,aDate){
    var tempKey = "wow >>> "+payload.id;
    var last_seen = nowDate+"-"+aDate.getHours()+":00";


    return extra.existsAsync(tempKey).then(function(res){
        var isKey = 'reco_appearances';
        var isKeyDate = 'last_seen';
        if (res == 0){
            console.log(tempKey);
            return extra.hmsetAsync(tempKey,
                        "id",payload.id,
                        "title",payload.title,
                        "cover",payload.cover,
                        "link",payload.link,
                        "last_seen",last_seen,
                        "reco_appearances",1).then(function(res){
                            return extra.saddAsync("archive_id_wow",payload.id).then(function(res1){
                                return res;
                            });
                        });
        }
        else{
            return extra.hgetallAsync(tempKey).then(function(res1){

                var isCurr = res1.reco_appearances;
                var isCurrDate = res1.last_seen.split("-");
                isCurrDate[3] = isCurrDate[3].split(':');
                isCurrDate = new Date(parseInt(isCurrDate[0]),parseInt(isCurrDate[1])-1,parseInt(isCurrDate[2]),parseInt(isCurrDate[3][0]));
                var temp_last_seen = last_seen.split("-");
                temp_last_seen[3] = temp_last_seen[3].split(':');
                temp_last_seen = new Date(parseInt(temp_last_seen[0]),parseInt(temp_last_seen[1])-1,parseInt(temp_last_seen[2]),parseInt(temp_last_seen[3][0]));
                verdict = temp_last_seen > isCurrDate ? true:false;

                if(verdict == true){
                    // console.log("Success");
                    // console.log(tempKey);
                    var isAmount = parseInt(isCurr) + 1;
                    return extra.hmsetAsync(tempKey,isKey,isAmount,isKeyDate,last_seen).then(function(res2){
                            return res2;
                    })
                }
                else{
                    return 1;
                }

            });
        }
    });
}

function createARecordBam(payload,nowDate,aDate){
    var tempKey = "bam >>> "+payload.id;
    var last_seen = nowDate+"-"+aDate.getHours()+":00";

    return extra.existsAsync(tempKey).then(function(res){
        var isKey = "reco_appearances";
        var isKeyDate = "last_seen";
        if(payload.thumb == null){
            payload.thumb = "null";
        }
        if(payload.il_thumb == null){
            payload.il_thumb = "null";
        }
        if(payload.featured_thumb == null){
            payload.featured_thumb = "null";
        }

        if(res == 0){
            console.log(tempKey);
            return extra.hmsetAsync(tempKey,
                        "id",payload.id,
                        "title",payload.title,
                        "thumb",payload.thumb,
                        "featured_thumb",payload.featured_thumb,
                        "il_thumb",payload.il_thumb,
                        "last_seen",last_seen,
                        "reco_appearances",1).then(function(res){
                            return extra.saddAsync("archive_id_bam",payload.id).then(function(res1){
                                return res;
                            });
                        });
        }

        else{
            return extra.hgetallAsync(tempKey).then(function(res1){

                var isCurr = res1.reco_appearances;
                var isCurrDate = res1.last_seen.split("-");
                isCurrDate[3] = isCurrDate[3].split(':');
                isCurrDate = new Date(parseInt(isCurrDate[0]),parseInt(isCurrDate[1])-1,parseInt(isCurrDate[2]),parseInt(isCurrDate[3][0]));
                var temp_last_seen = last_seen.split("-");
                temp_last_seen[3] = temp_last_seen[3].split(':');
                temp_last_seen = new Date(parseInt(temp_last_seen[0]),parseInt(temp_last_seen[1])-1,parseInt(temp_last_seen[2]),parseInt(temp_last_seen[3][0]));
                verdict = temp_last_seen > isCurrDate ? true:false;

                if(verdict == true){
                    // console.log("Success");
                    // console.log(tempKey);
                    var isAmount = parseInt(isCurr) + 1;
                    return extra.hmsetAsync(tempKey,isKey,isAmount,isKeyDate,last_seen).then(function(res2){
                            return res2;
                    })
                }
                else{
                    return 1;
                }

            });
        }

    });
}

function dateTranslate(dateString){
    let dateStringTemp = "";
    dateString = dateString.toLocaleDateString();
    dateString = dateString.split('/');
    dateStringTemp = dateString[0];
    dateString[0] = dateString[2];
    dateString[2] = dateString[1];
    dateString[1] = dateStringTemp;
    dateString = dateString.join('-');
    return dateString;
}

trendcrawl();
