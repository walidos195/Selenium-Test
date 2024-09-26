const { Builder, By, Key, until, Select , WebDriver } = require('selenium-webdriver'); 
const Chrome = require('selenium-webdriver/chrome');
const { Options } = require('selenium-webdriver/chrome'); 
const options = new Chrome.Options(); 
const fs = require("fs").promises; 
const { resolve } = require('path'); 
const driver = new Builder().forBrowser('chrome').setChromeOptions(options.addArguments('--disable-search-engine-choice-screen')).build(); 

// Chemin du fichier CSV contenant les offres d'emploi
const path = "datatable.csv";

async function login() { 
  return new Promise(async resolve => { 
    try { 
      // Configurer un délai d'attente implicite de 10 secondes
      driver.manage().setTimeouts({ implicit: 10000 }); 
      
      // Accéder au site du portail d'emploi
      await driver.get("https://rpaexercise.aisingapore.org/jobs"); 
      
      // Récupérer les champs de saisie pour le nom d'utilisateur et le mot de passe
      let username = await driver.findElement(By.xpath("//*[@id='outlined-search']")); 
      let password = await driver.findElement(By.xpath("//*[@id='password']"));
      
      // Entrer les informations d'identification de Jane
      await username.sendKeys("jane007"); 
      await password.sendKeys("TheBestHR123");
      
      // Cliquer sur le bouton de connexion
      await driver.findElement(By.xpath("//*[@id='login']/span[1]")).click(); 
    } 
    finally { 
      // Code commenté pour ne pas fermer le navigateur immédiatement
      //await driver.quit();
    } 
    
    resolve(); 
  });
}

async function appendJob() { 
  return new Promise(async resolve => { 
    try { 
      // Lire le fichier CSV contenant les offres d'emploi
      const data = await fs.readFile(path, "utf8").catch((err) => console.error('Failed to read file', err)); 
      
      // Diviser les données en lignes
      const lines = data.split("\n"); 
      
      // Initialiser un tableau de sortie pour stocker les offres
      const output = [];
      
      // Traiter chaque ligne et diviser les champs
      lines.forEach((line) => { 
        const fields = line.split(","); 
        output.push(fields); 
      });
      
      var i = 0; 
      
      // Parcourir chaque offre à partir du fichier CSV
      for await (const lines of output) { 
        
        if (i > 0) { 
          // Cliquer sur le bouton pour ajouter une nouvelle offre
          await driver.findElement(By.xpath("//*[@id='newJobPosting']/span[1]")).click(); 
          
          // Entrer les détails de l'offre d'emploi
          await driver.findElement(By.xpath("//*[@id='jobTitle']")).sendKeys(lines[1]);
          await driver.findElement(By.xpath("//*[@id='jobDescription']")).sendKeys(lines[2]);
          
          // Sélectionner le département et le niveau d'éducation
          const select = await new Select(driver.findElement(By.xpath("//*[@id='hiringDepartment']")));
          await select.selectByValue(lines[3]);
          const secondSelect = await new Select(driver.findElement(By.xpath("//*[@id='educationLevel']")));
          await secondSelect.selectByValue(lines[4]);
          
          // Entrer les dates de début et de fin de l'offre
          await driver.findElement(By.xpath("//*[@id='postingStartDate']")).sendKeys(lines[5]);
          await driver.findElement(By.xpath("//*[@id='postingEndDate']")).sendKeys(lines[6]);
          
          // Cocher la case si le poste est à distance
          if (lines[7] == "Yes") { 
            await driver.findElement(By.xpath("//*[@id='remote']/label[1]/span[1]/span[1]")).click(); 
          } else { 
            await driver.findElement(By.xpath("//*[@id='remote']/label[2]/span[1]/span[1]")).click(); 
          }
          
          // Sélectionner les types de contrat
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
          
          // Soumettre l'offre d'emploi
          await driver.findElement(By.xpath("//*[@id='submit']/span[1]")).click(); 
        }
        
        // Incrémenter le compteur de ligne
        i = i + 1; 
      }
    } 
    finally { 
      //await driver.quit();
    } 
    resolve(); 
  });
}

async function browseJob() {
  return new Promise(async resolve => { 
    try { 
      // Récupérer tous les éléments de la liste des offres publiées
      var elems = (await driver.findElements(By.xpath("//*[@id='root']/div/div/div[2]/div[2]/div"))); 
      
      // Parcourir chaque offre d'emploi
      for (let index = 0; index < elems.length; index++) { 
        const element = elems[index]; 
        var i = index + 1; 
        
        // Accéder à la page de candidats pour chaque offre
        await driver.findElement(By.xpath("//*[@id='root']/div/div/div[2]/div[2]/div["+i+"]/div/div[2]/div/a/button/span[1]")).click();
        await browseCandidats(); 
        
        // Retourner à la liste des offres après traitement
        const back = await driver.findElements(By.xpath("//*[@id='backToList']/span[1]")); 
        if(back.length >= 1){ 
          await driver.findElement(By.xpath("//*[@id='backToList']/span[1]")).click(); 
        }
      }
    } 
    finally { 
      // Rien à faire ici pour l'instant
    }
    resolve(); 
  });
}

async function browseCandidats() {
  return new Promise(async resolve => { 
    try { 
      // Récupérer tous les candidats pour l'offre en cours
      var elems = (await driver.findElements(By.className("MuiTableRow-root"))); 
      
      // Parcourir chaque candidat
      for (let index = 0; index < elems.length - 1; index++) { 
        var i = index + 1; 
        
        // Récupérer le score de pré-sélection et les niveaux d'éducation
        var preScore = await driver.findElement(By.xpath("//*[@id='root']/div/div/div[2]/div[2]/div[2]/table/tbody/tr["+i+"]/td[5]")).getText();
        var firstLevel = await driver.findElement(By.xpath("//*[@id='root']/div/div/div[2]/div[2]/div[2]/table/tbody/tr["+i+"]/td[4]")).getText(); 
        var secondLevel = await driver.findElement(By.xpath("//*[@id='root']/div/div/div[2]/div[2]/div[1]/div[10]/p")).getText();
        
        
        // Accepter ou rejeter le candidat selon les critères
        if (parseInt(preScore) > 70 && firstLevel == secondLevel) { 
          await driver.findElement(By.xpath("//*[@id='root']/div/div/div[2]/div[2]/div[2]/table/tbody/tr["+i+"]/td[7]/div/div/button[1]/span[1]")).click();
        } else { 
          await driver.findElement(By.xpath("//*[@id='root']/div/div/div[2]/div[2]/div[2]/table/tbody/tr["+i+"]/td[7]/div/div/button[2]/span[1]")).click(); 
        }
      }
    } 
    finally { 
      // Rien à faire ici pour l'instant
    }
    resolve(); 
  });
}

module.exports = {
  login, appendJob, browseJob 
};
