
// Standard values, visit page etc;

const login_page_fb = 'https://facebook.com/login/';
const page_fb = 'https://facebook.com/';
const instant_games_fb = 'https://facebook.com/instantgames/';``

//ID for email input in facebook login;
const EMAIL_SELECTOR = '#email';
//ID for pass input in facebook login;
const PASSWORD_SELECTOR = '#pass';
//ID for login button in facebook login;
const LOG_IN_BUTTON = '#loginbutton';
//REDIS commands reference
const extra= require("./extra");
const puppeteer = require('puppeteer');


var ext_page = null;
var ext_brow = null;


// initial 30 games when the code was made, no way on knowing
// Game ids via XML so manual encoding
var exist_data =[
                ['843754115785933','Quiz Planet', 'Lotum one Gmbh', 'Trivia & Word'],
                ['383041995381848','Words With Friends','Zynga', 'Trivia & Word'],
                ['198982457542294','Jumpy Jumpy - Helix Ball','TimPlay','PUZZLE'],
                ['141184676316522','EverWing','Game Closure','ACTION'],
                ['2141327352781157','Flying Gun','LIM','ACTION'],
                ['1939015149698140','UNO','Mattel163','CARD'],
                ['1250735238360354','Last Knife','Room502','ACTION'],
                ['666272906903117','The Test', 'Lotum one GmbH', 'TRIVIA & WORD'],
                ['1250735238360354', 'Tetris', 'CoolGames', 'PUZZLE'],
                ['1192247540901063','Chess', 'Vizor Interactive, LLP', 'BOARD'],
                ['498625833822107','4 Pics 1 Word','LOTUM GmbH','TRIVIA & WORD'],
                ['1983392221930776','Let\'s Farm-Idle Tycoon','diandian','SIMULATION'],
                ['1829935823906294', '8 Ball Pool', 'Miniclip', 'SPORTS'],
                ['2123873081225075', 'Big Fish', 'bianfeng', 'SIMULATION'],
                ['800772590062226', 'Basketball FRVR', 'FRVR', 'SPORTS'],
                ['1015995975216459', 'EvoWars', 'Neexeen Entertainment', 'ACTION'],
                ['370866070095402','Guess the Logo','TapLane Inc.','TRIVIA & WORD'],
                ['203379533634849','Guess the Food','Taplane Inc.','TRIVIA & WORD'],
                ['1766150917023645', 'Snake Mania', 'SZ IYouLong', 'RUNNER'],
                ['823249154498832','Draw and Guess!','Vizor Interactive, LLP','BOARD'],
                ['2031775343755563', 'Tank Battle - 3V3', 'SeaStar Game', 'MOBA'],
                ['1545834658847763', 'Hanger', 'A Small Game AB', 'RUNNER'],
                ['546661508998943', 'Panda Fighting', 'cocos', 'CARD BATTLE'],
                ['151058255530346', 'Never Have I Ever', 'vonvon', 'TRIVIA & WORD'],
                ['875164359357457', 'Guitar Hit', 'Ruocco', 'SIMULATION'],
                ['535479800181263','Guess the Icon','TapLane Inc.','TRIVIA & WORD'],
                ['1806508339421996','LOL Headshot', 'Nuts Play', 'SIMULATION'],
                ['1402577869863533','Word Shuffle','Words Puzzle Games','TRIVIA & WORD'],
                ['1920856321568946','Cookie Crush', 'SOFTGAMES', 'MATCH 3'],
                ['1045899222230952', 'Helix Bounce', 'Tri.App', 'ACTION'],
                ['1874283069567925','Poker','Super Happy Fun Time','POKER & TABLE']
                ];
var rawr;
var ra = 0;

var game_key;

var async = require('async');

client.on('error',function(err){
     console.log("Error " + err);
});

// save function
function insertToRedis(list,onRep,message){



    tempList = [];

    //on Repeat, just to know if i still keep getting pages
    console.log("rawr");
    if(onRep){
        console.log("graphql");
    }
    else{
        console.log("Start");
    }


    //new Locale date returns dd/mm/yy
    //need to change it to YY-MM-DD
    nowDate = new Date;
    nowDate = nowDate.toLocaleDateString();
    nowDate = nowDate.split('/');
    nowDateTemp = nowDate[0];
    nowDate[0] = nowDate[2];
    nowDate[2] = nowDate[1];
    nowDate[1] = nowDateTemp;
    nowDate = nowDate.join('-');

    if(list.length > 0){

        //Minor checking just in case
        for(let x = 0, a = list, llen = list.length;x<llen;x++){
            game_key = nowDate +":"+a[x][1];
            if(a[x][1] != undefined && a[x][1] != null ){

                if(a[x][3] == undefined || a[x][3]== null || a[x][3] == ""){
                    a[x][3] = "UNKNOWN";
                }

                if(a[x][2] == undefined || a[x][2] == null || a[x][2] == ""){
                    a[x][2] = "UNKNOWN";
                }

                if(a[x][0] == undefined || a[x][0] == null || a[x][0] == ""){
                    a[x][0] = "";
                }

                //Trying to catch the LOL games, about 3 with the same name
                if(a[x][1] == "LOL\nI-manage" ){
                    console.log("Found Dupe: "+a[x][1]+" by "+a[x][2]);
                    console.log(a[x][4]);
                    a[x][1] = "LOL by "+a[x][2];
                }
                if(a[x][2] == "App Peppers" ){
                    console.log("Found Dupe: "+a[x][1]+" by "+a[x][2]);

                }

                //Now have a master list
                extra.existsAsync(a[x][1]).then(function(res){
                    if(res == 1){

                    }
                    else{
                        extra.saddAsync("archive",a[x][1]).then(function(rep){
                            if(rep){

                                extra.hmsetAsync(a[x][1],
                                            "id",a[x][0],
                                            "name",a[x][1],
                                            "developer",a[x][2],
                                            "category",a[x][3],
                                            "first_date",nowDate).then(function(res){

                                            });
                            }
                        });
                    }
                });

                //per Date table
                extra.hexistsAsync(nowDate,a[x][1]).then(function(res){
                    if(res == 1){

                    }

                    else{

                        extra.hsetAsync(nowDate,a[x][1],a[x][4]).then(function(res){

                        });
                        extra.hsetAsync(a[x][1],"count",a[x][4]).then(function(res){

                        });
                    }
                });

            }
        }


        //25 pages limit i set, scroll down until 25 pages
        if(ra <= 25){
            ra++;
            scrollDown();
        }

        else{
            closeDown();
        }

    }

    else{
        closeDown();
    }

    return list;
}

//This is the intercepted XML of new games
function printRawr(text){
    //Since it is now a object, easier to farm
    rawr = text;
    var atext = text.data.instant_games_recommendation_details;
    alist= [];
    var message = "";
    if(atext.length>0){

        for(let x = 0; x < atext.length; x++){
            //Get Basic info
            id = atext[x].id;
            cat = atext[x].app_center_categories[1];
            curr = atext[x].instant_game_info;


            if(curr.player_count == null){
                tempIndex = 0;
            }

            else if(curr.player_count.indexOf('K') != -1 && curr.player_count.indexOf('M') == -1){
                tempIndex = curr.player_count.replace("K",'');
                tempIndex = parseFloat(tempIndex);

                tempIndex = tempIndex*1000;
            }

            else if(curr.player_count.indexOf('K') == -1 && curr.player_count.indexOf('M') != -1){
                tempIndex = curr.player_count.replace("M",'');
                tempIndex = parseFloat(tempIndex);

                tempIndex = tempIndex*1000000;
            }

            tempIndex = parseInt(tempIndex);
            if(cat == undefined || cat == null){
                cat = "UNKNOWN";
            }

            if(curr.developer_name == undefined || curr.developer_name == null){
                curr.developer_name = "UNKNOWN";
            }

            //Make a list of valid entries from additional pages
            alist.push([id.trim(),curr.game_name.trim(),curr.developer_name.trim(),cat.trim().toUpperCase(),tempIndex]);


        }
        //Insert to Redis intercepted pages
        insertToRedis(alist,true,message);
    }

    else{

    }

    return alist;
}


async function igcrawl(){

    //Initiate browser
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--disable-notifications','--no-sandbox', '--disable-setuid-sandbox']
    });

    //make a tab
    const page = await browser.newPage();
    ext_page = page;
    ext_brow = browser

    //minor optimization
    //dont load pictures we dont need them
    await page.setRequestInterception(true);
    page.on('request', request => {
     if (request.resourceType() === 'image')
       request.abort();
     else
       request.continue();
     });






    //Spam and refresh instant games page
    //Instnt Games doesnt load the games sometimes
    await page.goto(instant_games_fb,{waitUntil: 'networkidle2'});
    await page.waitFor(2*1000);
    await page.goto(instant_games_fb,{waitUntil: 'networkidle2'});
    await page.waitFor(3*1000);
    await page.goto(instant_games_fb,{waitUntil: 'networkidle2'});
    await page.waitFor(4*1000);

    // headless click category

    ga_list = [];
    ga_div_list = [];

    //evaluate page
    var games_list = await page.evaluate((ga_div_list,ga_list,exist_data)=> {

      //Get all games thumbnails
      gar_list = document.getElementsByClassName('_6gu7');

      //gar_list returns a node collection, need to convert to array
      ga_list = Array.from(gar_list);


      if(ga_list.length >= 15 ){
          for(let x = 0,ga_len = ga_list.length; x<ga_len;x++){

              //trim html collections
              ga_div_list.push(Array.from(ga_list[x].children));





              //get player count
              //storing it in tempIndex

              ga_div_list[x][1] = ga_div_list[x][1].innerText;
              tempIndex = ga_div_list[x][1].indexOf(" ");
              ga_div_list[x][1] = ga_div_list[x][1].slice(0,tempIndex);
              tempIndex =  ga_div_list[x][1];




              //trim name, company, and category
              tempInfo = ga_div_list[x][0].children[1];
              ga_div_list[x][0] = tempInfo.children[0].innerText.trim();
              ga_div_list[x][1] = tempInfo.children[1].innerText.trim();
              if(ga_div_list[x].length ==3){
                  ga_div_list[x].pop(); //important
                  //getting rid of an empty something;
              }
              ga_div_list[x].push(tempInfo.children[2].innerText.trim().toUpperCase());


              //If the count didnt show, assume zero;
              if(tempIndex == null){
                  tempIndex = 0;
              }

              //do the math, when K appears in the player index
              else if(tempIndex.indexOf('K') != -1 && tempIndex.indexOf('M') == -1){
                  tempIndex.replace("K",'');
                  tempIndex = parseFloat(tempIndex);
                  tempIndex = tempIndex*1000;
              }

              //do the math, when M appears in the player index
              else if(tempIndex.indexOf('K') == -1 && tempIndex.indexOf('M') != -1){
                  tempIndex.replace("M",'');
                  tempIndex = parseFloat(tempIndex);
                  tempIndex = tempIndex*1000000;
              }
              ga_div_list[x].push(parseInt(tempIndex));

              //insert null app id, temporary
              //exist_data is the large array up top, if the name of current game in the list, provide game id from exist data array
              ga_div_list[x].unshift(null);
              for(let y = 0, enlen = exist_data.length ; y<enlen; y++){
                  if(ga_div_list[x][1] == exist_data[y][1]){
                      ga_div_list[x][0] = exist_data[y][0];
                      break;
                  }
              }
          }
        }


    //Those who only have the valid data
    //Id,name,player count index, publisher, category
    //will be accepted
     ga_list = [];
     if(ga_div_list.length > 0){
         for(i = 0;i < ga_div_list.length;i++){
             if(ga_div_list[i].length == 5){
                 ga_list.push(ga_div_list[i]);
             }
         }
     }


      return ga_list;
  },ga_div_list,ga_list,exist_data);


    //Additional pages can be intercepted via reading XML
    //games will now be received as json
    //this doesnt connect with the first 30 games
    //on line 281
    asd = page.on('response', response => {
      if(response.url() == 'https://www.facebook.com/api/graphql/'){
          graphql = response.json().then(function(something){
              graphGamesBatch = printRawr(something);
              return graphGamesBatch;
       });
      }

    });

    //if games_list (line 281) returns a list of games
    //Insert to redis
    if(games_list.length > 0){
        console.log("Eval");
        insertToRedis(games_list,false,'');
    }

    else{
        console.log("Closing");
        closeDown();
    }
    //Else we didnt even see the first page load so close down();

}


//Literally what it means
function scrollDown(){
    ext_page.evaluate(()=> {
      window.scroll(0,document.body.scrollHeight);
    });
}

//Literally what it means
function closeDown(){
    console.log("Closing");
    ext_brow.close();
    process.exit(0);
}



//Start
igcrawl();
