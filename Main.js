var login = require("./testQa");


async function runAllFunctions() {
    await login.login();
    await login.appendJob();
    await login.browseJob();
    await log("Toutes les fonctions sont terminées !");
}
async function log(text) {
    return new Promise(resolve => {

        console.log(text);
        resolve();

    });
}
runAllFunctions();