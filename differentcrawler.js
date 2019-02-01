
const extra = require("./extra");
const puppeteer = require('puppeteer');
const async = require('async');


async function setThingsUp(){

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--disable-notifications','--no-sandbox', '--disable-setuid-sandbox']
    });


    //make a tab
    const page = await browser.newPage();
    const page1 = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', request => {
     if (request.resourceType() === 'image')
       request.abort();
     else
       request.continue();
     });

    {
        const login_page_fb = 'https://facebook.com/login/';
        const page_fb = 'https://facebook.com';
        //ID for email input in facebook login;
        const EMAIL_SELECTOR = '#email';
        //ID for pass input in facebook login;
        const PASSWORD_SELECTOR = '#pass';
        //ID for login button in facebook login;
        const LOG_IN_BUTTON = '#loginbutton';

        // await page1.goto(login_page_fb,{waitUntil: 'networkidle2'});
        // await page1.click(EMAIL_SELECTOR);
        // await page1.keyboard.type("dummybunnywings@gmail.com");
        // await page1.click(PASSWORD_SELECTOR);
        // await page1.keyboard.type("13dummybunny");
        // await page1.click(LOG_IN_BUTTON);
        // await page1.waitFor(2*1000);
        // await page.goto(page_fb,{waitUntil: 'networkidle2'});
        // await page1.close();

        retrieveTriviaEntries(page,browser);

    }
}

async function retrieveTriviaEntries(page,browser){
    {
        var listOfIDs = await extra.smembersAsync("archive_id").then(function(rep){
            return rep;
        });

         for(let i = 0; i<listOfIDs.length;i++){
            extra.hgetallAsync(listOfIDs[i]).then(function(reply){
                if(reply.category == "TRIVIA & WORD"){
                    console.log(reply);
                }
            });
        }


    }

}


setThingsUp();
