const login_page_fb = 'https://facebook.com/login/';
const page_fb = 'https://facebook.com/';
const instant_games_fb = 'https://facebook.com/instantgames/';``
const EMAIL_SELECTOR = '#email';
const PASSWORD_SELECTOR = '#pass';
const LOG_IN_BUTTON = '#loginbutton';
const extra= require("./extra");
var ext_page = null;
var ext_brow = null;

const puppeteer = require('puppeteer');
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


function insertToRedis(list,onRep){


    tempList = [];

    console.log("rawr");
    if(onRep){
        console.log("graphql");
    }
    else{
        console.log("Start");
    }

    nowDate = new Date;
    nowDate = nowDate.toLocaleDateString();

    if(list.length > 0){

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

                extra.hsetAsync(nowDate,a[x][1],a[x][4]).then(function(res){

                });
                extra.hsetAsync(a[x][1],"count",a[x][4]).then(function(res){

                });

            }
        }


        if(ra <= 15){
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


function printRawr(text){
    rawr = text;
    var atext = text.data.instant_games_recommendation_details;
    alist= [];
    if(atext.length>0){

        for(let x = 0; x < atext.length; x++){
            id = atext[x].id;
            cat = atext[x].app_center_categories[1];
            curr = atext[x].instant_game_info;
            // console.log("last here na "+curr.game_name);
            // console.log("last here "+curr.player_count);

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

            alist.push([id.trim(),curr.game_name.trim(),curr.developer_name.trim(),cat.trim().toUpperCase(),tempIndex]);
        }

        insertToRedis(alist,true);
    }

    else{

    }

    return alist;
}

async function igcrawl(){

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--disable-notifications','--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    ext_page = page;
    ext_brow = browser

    await page.setRequestInterception(true);
    page.on('request', request => {
     if (request.resourceType() === 'image')
       request.abort();
     else
       request.continue();
     });




     // await page.goto(login_page_fb,{waitUntil: 'networkidle2'});
     //
     // await page.click(EMAIL_SELECTOR);
     // await page.keyboard.type(cred_name);
     //
     // await page.click(PASSWORD_SELECTOR);
     // await page.keyboard.type(cred_pass);
     //
     // await page.click(LOG_IN_BUTTON);
     //

     // await page.waitFor(3*1000);


    await page.goto(instant_games_fb,{waitUntil: 'networkidle2'});

    // await page.waitForNavigation();
    await page.waitFor(2*1000);
    await page.goto(instant_games_fb,{waitUntil: 'networkidle2'});
    await page.waitFor(3*1000);
    await page.goto(instant_games_fb,{waitUntil: 'networkidle2'});
    await page.waitFor(4*1000);


    ga_list = [];
    ga_div_list = [];
    var games_list = await page.evaluate((ga_div_list,ga_list,exist_data)=> {
      gar_list = document.getElementsByClassName('_6gu7');
      ga_list = Array.from(gar_list);
      // console.log("ga_list "+ga_list.length);
      if(ga_list.length >= 15 ){
          for(let x = 0,ga_len = ga_list.length; x<ga_len;x++){

              //trim html collections
              ga_div_list.push(Array.from(ga_list[x].children));
              // ga_div_list[x].pop(); //important




              //get player count

              ga_div_list[x][1] = ga_div_list[x][1].innerText;
              tempIndex = ga_div_list[x][1].indexOf(" ");
              ga_div_list[x][1] = ga_div_list[x][1].slice(0,tempIndex);
              tempIndex =  ga_div_list[x][1];


              //trim name, company, and cat


              tempInfo = ga_div_list[x][0].children[1];
              ga_div_list[x][0] = tempInfo.children[0].innerText.trim();
              ga_div_list[x][1] = tempInfo.children[1].innerText.trim();
              if(ga_div_list[x].length ==3){
                  ga_div_list[x].pop(); //important
              }
              ga_div_list[x].push(tempInfo.children[2].innerText.trim().toUpperCase());

              // else{
              //     tempInfo = ga_div_list[x][0].children[1];
              //     ga_div_list[x][0] = tempInfo.children[0].innerText.trim();
              //      ga_div_list[x][1] = ga_div_list[x][1] == null ||  ga_div_list[x][1] == undefined ? "UNKNOWN": tempInfo.children[1].innerText.trim();
              //      if(tempInfo.children[2].innerText == null || tempInfo.children[2].innerText == undefined){
              //           ga_div_list[x].push("UNKNOWN");
              //      }
              //      else{
              //           ga_div_list[x].push(tempInfo.children[2].innerText.trim().toUpperCase());
              //      }
              // }

              if(tempIndex == null){
                  tempIndex = 0;
              }

              else if(tempIndex.indexOf('K') != -1 && tempIndex.indexOf('M') == -1){
                  tempIndex.replace("K",'');
                  tempIndex = parseFloat(tempIndex);
                  tempIndex = tempIndex*1000;
              }

              else if(tempIndex.indexOf('K') == -1 && tempIndex.indexOf('M') != -1){
                  tempIndex.replace("M",'');
                  tempIndex = parseFloat(tempIndex);
                  tempIndex = tempIndex*1000000;
              }
              ga_div_list[x].push(parseInt(tempIndex));

              //insert null app id, temporary
              ga_div_list[x].unshift(null);
              for(let y = 0, enlen = exist_data.length ; y<enlen; y++){
                  if(ga_div_list[x][1] == exist_data[y][1]){
                      ga_div_list[x][0] = exist_data[y][0];
                      break;
                  }
              }
          }
        }

     ga_list = [];
     if(ga_div_list.length > 0){
         for(i = 0;i < ga_div_list.length;i++){
             if(ga_div_list[i].length == 5){
                 ga_list.push(ga_div_list[i]);
             }
         }
     }

      // console.log(ga_div_list);
      // console.log(ga_list);
      return ga_list;
  },ga_div_list,ga_list,exist_data);


    asd = page.on('response', response => {
      if(response.url() == 'https://www.facebook.com/api/graphql/'){
          graphql = response.json().then(function(something){
              graphGamesBatch = printRawr(something);
              return graphGamesBatch;
       });
      }

    });

    if(games_list.length > 0){
        console.log("Eval");
        insertToRedis(games_list,false);
    }

    else{
        console.log("Closing");
        closeDown();
    }


}


function scrollDown(){
    ext_page.evaluate(()=> {
      window.scroll(0,document.body.scrollHeight);
    });
}

function closeDown(){
    console.log("Closing");
    ext_brow.close();
    process.exit(0);
}


igcrawl();
