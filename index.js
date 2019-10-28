//itinitalize main components
const express = require('express');
const app = express();
const config = require("./config");
const moduleLoader = require("./lib/loadModules");
const bp = require("body-parser")
const session = require('express-session')
const h = require("./lib/helpers")

//session cookie config
app.use(session({
    secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  //secure should be set to true but i did not get it to work with https throug cloudflare
  //TODO: make work
  cookie: { secure: false,httpOnly:false }
}))

//serve static css files, this would be better to do with something like nginx but idc
app.use("/style",express.static("./front/style"))
app.use(bp.urlencoded({extended: true}))
//Database
const sqlite = require("sqlite3").verbose();
let db = new sqlite.Database("./data/data.db");

module.exports = {
    //pass databse
    db:db,
    //packages that are needed globaly
    requiredPackages: ["express-session","express","sqlite3"]
}
//Load modules
let mList = moduleLoader("./modules");


//itterate through modules 
mList.forEach(m=> {
    if(m.type === "misc") {
        m.onLoad ? m.onLoad(mList) : null
    }
    else if(m.type === 'router') {
        app.use(m.baseUrl,m.router);
    }
}) 
app.listen(config.port||3000,() => {
    h.log(`webserver started @ ${config.host}`,h.logTypes.ok)
});
