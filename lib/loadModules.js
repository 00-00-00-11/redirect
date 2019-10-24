const fs = require("fs");

module.exports = (path) => {
    if(!path) return;
    let mArr = [];
    itterateDirectoryToGetAllModulesAlsoDidiTellYouFunctionNamesAreEasyAndiHonestlyWonderWhyPeopleHaveAproblemWithTHem(path,mArr);
    return mArr;
}

const itterateDirectoryToGetAllModulesAlsoDidiTellYouFunctionNamesAreEasyAndiHonestlyWonderWhyPeopleHaveAproblemWithTHem = (path,arr) => {
    fs.readdirSync(path).forEach(f => {
        const fDir = `${path}/${f}`;
        const status  = fs.statSync(fDir);
        if(status && status.isDirectory()) {
            itterateDirectoryToGetAllModulesAlsoDidiTellYouFunctionNamesAreEasyAndiHonestlyWonderWhyPeopleHaveAproblemWithTHem(fDir,arr);
        } else {
            if(!fDir.endsWith(".js")) return;
            const m = require(`../${fDir}`);
            arr.push(m);   
        }
    })
}