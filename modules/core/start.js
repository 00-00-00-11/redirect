var db = require("../../index").db
const h = require("../../lib/helpers")
const c = require("../../config")

const checkConditions = () => {
    h.log(`version: ${c.applicationMeta.version}`)
    h.log(`operating system: ${require("os").platform()}`)
    let missingPackages = []
    for(let i = 0; i < c.applicationMeta.required_packages.length; i++) {
        try {
            let p = require.resolve(c.applicationMeta.required_packages[i])
            h.log(`required package "${c.applicationMeta.required_packages[i]}" exists!`,h.logTypes.ok)
        } catch(e) {
            h.log(`required package "${c.applicationMeta.required_packages[i]}" is missing!`,h.logTypes.warn)
            missingPackages.push(c.applicationMeta.required_packages[i])
        }
    }
    if(missingPackages.length != 0) {
        h.log(`missing ${missingPackages.length} required package(s). try "npm i ${missingPackages.join(" ")}" to download required packages.`,h.logTypes.error)
        process.exit(1);
    }
}

const onLoad = () => {
    var args = process.argv.slice(2).join(" ");
    if(args.includes("-newDb")) {
            db.run("CREATE TABLE links (id TEXT,link TEXT,user TEXT,json TEXT)",(e) => {
                if(e) return h.log(e,h.logTypes.error)
                h.log("created table links",h.logTypes.ok)
            })
            db.run("CREATE TABLE users (id TEXT,password TEXT,json TEXT)",(e) => {
                if(e) return h.log(e,h.logTypes.error)
                h.log("created table links",h.logTypes.ok)
            })
    }

    checkConditions()

}

module.exports = {
    type: 'misc',
    onLoad: onLoad
}
