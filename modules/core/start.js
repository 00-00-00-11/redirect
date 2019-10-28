var db = require("../../index").db
const h = require("../../lib/helpers")
const c = require("../../config")


const checkConditions = (ml) => {
    //log version
    h.log(`version: ${c.applicationMeta.version}`)
    //log os. unneeded but i thought it was cool, fuck you
    h.log(`operating system: ${require("os").platform()}`)
    //initialize array
    let missingPackages = []
    //initialize requiredPackages array
    let requiredPackages = require("../../index").requiredPackages
    //itterate through modules and push their required packages
    ml.forEach(m => {
        if(m.requiredPackages) requiredPackages.push(...m.requiredPackages)
    })

    //i require the loopz bröther
    for(let i = 0; i < requiredPackages.length; i++) {
        try {
            //require the package. if it does not exist it will throw an err
            let p = require.resolve(requiredPackages[i])
            h.log(`required package "${requiredPackages[i]}" exists!`,h.logTypes.ok)
        } catch(e) {
            h.log(`required package "${requiredPackages[i]}" is missing!`,h.logTypes.warn)
            //if required package does not exist push to array
            missingPackages.push(requiredPackages[i])
        }
    }
    //whenver there are packages missing
    if(missingPackages.length != 0) {
        //generate string to download missing packages
        h.log(`missing ${missingPackages.length} required package(s). try "npm i ${missingPackages.join(" ")}" to download required packages.`,h.logTypes.error)
        //exit application with error. this is maybe a bit annoying but it is better then passwords ening up unencrypted or whatever. safety is number one priotity
        process.exit(1);
    }
}

const onLoad = (ml) => {
    //fetch cmdline arguments and remove first 2 since they only hold node executable location and proj location
    var args = process.argv.slice(2).join(" ");
    if(args.includes("-newDb")) {
        //create tables
            db.run("CREATE TABLE links (id TEXT,link TEXT,user TEXT,json TEXT)",(e) => {
                if(e) return h.log(e,h.logTypes.error)
                h.log("created table links",h.logTypes.ok)
            })
            db.run("CREATE TABLE users (id TEXT,password TEXT,json TEXT)",(e) => {
                if(e) return h.log(e,h.logTypes.error)
                h.log("created table links",h.logTypes.ok)
            })
    }
    //make sure everything is ready to start
    checkConditions(ml)
}

module.exports = {
    type: 'misc',
    onLoad: onLoad
}
