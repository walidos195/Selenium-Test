const {Builder, By, Key, until} =require('selenium-webdriver');
const Chrome = require('selenium-webdriver/chrome');
const { Options } = require('selenium-webdriver/chrome');
const options = new Chrome.Options();
(async function example(){
 let driver = await new Builder().forBrowser('chrome').setChromeOptions(options.addArguments('--disable-search-engine-choice-screen')).build();
 
 try{
    await driver.manage().setTimeouts({implicit:10000});

    await driver.get("https://www.google.com");
    await driver.findElement(By.xpath("//div[text()='Tout accepter']")).click();
    
    await driver.findElement(By.xpath("//textarea")).sendKeys("test QA");
    await driver.findElement(By.xpath("//textarea")).sendKeys(Key.ENTER);
    let index=1;
    console.log("Hello");
    console.log(await driver.findElements(By.tagName("h3"))[1]);
    /*
    while (index < 12) {
        console.log(index.toString());
        if(index!=10 && index.toString().endsWith("1")==false ){
            var j=index+1;
            console.log(await driver.findElement(By.xpath("//*[@id='rso']/div["+j+"]/div/div/div[1]/div/div/span/a/h3")).getText());
        }
        else if (index.toString().endsWith("1") ) {
            
            console.log(await driver.findElements(By.tagName("h3")));
        } 

        index=index+1;
    }*/
}
 finally{
    //await driver.quit();
 }
 
})();