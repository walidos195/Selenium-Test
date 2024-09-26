const { Builder, By, Key, until, Select , WebDriver } = require('selenium-webdriver');
const Chrome = require('selenium-webdriver/chrome');
const { Options } = require('selenium-webdriver/chrome');
const options = new Chrome.Options();
const fs = require("fs").promises;
const { resolve } = require('path');
const driver = new Builder().forBrowser('chrome').setChromeOptions(options.addArguments('--disable-search-engine-choice-screen')).build();

const path = "datatable.csv";

async function login() {
  
  return new Promise(async resolve => {
    try {
      driver.manage().setTimeouts({ implicit: 10000 });
      
      await driver.get("https://rpaexercise.aisingapore.org/jobs");
      let username = await driver.findElement(By.xpath("//*[@id='outlined-search']"));
      let password = await driver.findElement(By.xpath("//*[@id='password']"));
      
      await username.sendKeys("jane007");
      await password.sendKeys("TheBestHR123");
      await driver.findElement(By.xpath("//*[@id='login']/span[1]")).click();
      
    }
    finally {
      //await driver.quit();
    }
    resolve();
  });
  
}
async function appendJob() {
  
  return new Promise(async resolve => {
    try {
      
      const data = await fs.readFile(path, "utf8").catch((err) => console.error('Failed to read file', err));
      
      // Split the data into lines
      const lines = data.split("\n");
      
      // Initialize the output array
      const output = [];
      
      // Loop through each line and split it into fields
      lines.forEach((line) => {
        const fields = line.split(",");
        output.push(fields);
      });
      
      var i = 0;
      
      for await (const lines of output) {
        
        if (i > 0) {
          await driver.findElement(By.xpath("//*[@id='newJobPosting']/span[1]")).click();
          await driver.findElement(By.xpath("//*[@id='jobTitle']")).sendKeys(lines[1]);
          
          await driver.findElement(By.xpath("//*[@id='jobDescription']")).sendKeys(lines[2]);
          

          const select = await new Select(driver.findElement(By.xpath("//*[@id='hiringDepartment']")));
          await select.selectByValue(lines[3]);
          const secondSelect = await new Select(driver.findElement(By.xpath("//*[@id='educationLevel']")));
          await secondSelect.selectByValue(lines[4]);
          await driver.findElement(By.xpath("//*[@id='postingStartDate']")).sendKeys(lines[5]);
          await driver.findElement(By.xpath("//*[@id='postingEndDate']")).sendKeys(lines[6]);
          if (lines[7] == "Yes") {
            await driver.findElement(By.xpath("//*[@id='remote']/label[1]/span[1]/span[1]")).click();
          }
          else {
            await driver.findElement(By.xpath("//*[@id='remote']/label[2]/span[1]/span[1]")).click();
          }
          const jobTypes = lines[8].split("/");
          for (const jobType of jobTypes) {
            switch (jobType) {
              case "Full-time":
                
                await driver.findElement(By.xpath("//*[@id='jobTypeFullTime']")).click();
                break;

                case "Part-time":
                  
                  await driver.findElement(By.xpath("//*[@id='jobTypePartTime']")).click();
                  break;
              case "Temp":
                
                await driver.findElement(By.xpath("//*[@id='jobTypeTemp']")).click();
                break;

                case "Permanent":
                  
                  await driver.findElement(By.xpath("//*[@id='jobTypePermanent']")).click();
                  break;
                  
                  default:
                break;
              }
            }
            
            
            
            
            await driver.findElement(By.xpath("//*[@id='submit']/span[1]")).click();
            
          }
          i = i + 1;
        }
        
        
      }
      finally {
        //await driver.quit();
      }
      resolve();
    });
  }
  
  async function browseJob(){
    
    return new Promise(async resolve=>{
      try{
        var elems= (await driver.findElements(By.xpath("//*[@id='root']/div/div/div[2]/div[2]/div")));
        for (let index = 0; index < elems.length; index++) {
          const element = elems[index];
        }
      }
      finally{
        
      }

    resolve();
  });



}


module.exports = {
  login,appendJob,browseJob
};
