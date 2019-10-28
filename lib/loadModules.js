const fs = require("fs");
//this code is stolen from a guy who stole it from SO

module.exports = (path) => {
    //If no path we no go >:(
    if(!path) return;
    //prepare module arr
    let mArr = [];
    //run hideusly named function
    itterateDirectoryToGetAllModulesAlsoDidiTellYouFunctionNamesAreEasyAndiHonestlyWonderWhyPeopleHaveAproblemWithTHem(path,mArr);
    //return module array
    return mArr;
}

//haha funny var name xDDDD. fuk you 5 days ago me, you suck.
//I wonder if i could use this to get karma on r/programmerhumor. i'd imagine it'd go like this:

// haha funny var name : posted by flexsealphill
// <image of this code>
// angryDude: this sucks
// | flexsealphill: you suck
// | | angryDudeAlt: get downvoted
// | iCodeInC#: js sucks and you suck
const itterateDirectoryToGetAllModulesAlsoDidiTellYouFunctionNamesAreEasyAndiHonestlyWonderWhyPeopleHaveAproblemWithTHem = (path,arr) => {
    //read dir
    fs.readdirSync(path).forEach(f => {
        //construct path str
        const fDir = `${path}/${f}`;
        //get status of path str
        const status  = fs.statSync(fDir);
        //if pth exists and is directory run function again
        if(status && status.isDirectory()) {
            itterateDirectoryToGetAllModulesAlsoDidiTellYouFunctionNamesAreEasyAndiHonestlyWonderWhyPeopleHaveAproblemWithTHem(fDir,arr);
        } else {
            //if not js file frick off
            if(!fDir.endsWith(".js")) return;
            //require modules
            const m = require(`../${fDir}`);
            //push module to array
            arr.push(m);   
        }
    })
}