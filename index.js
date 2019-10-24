//itinitalize main components
const express = require('express');
const app = express();
const config = require("./config");
const moduleLoader = require("./lib/loadModules");
const bp = require("body-parser")
const session = require('express-session')


app.use(session({
    secret: 'lol',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
app.use("/style",express.static("./front/style"))
app.use(bp.urlencoded({extended: true}))
//Database
const sqlite = require("sqlite3").verbose();
let db = new sqlite.Database("./data/data.db");

module.exports = {
    db:db
}

let mList = moduleLoader("./modules");

/*
    db.run("CREATE TABLE links (id TEXT,link TEXT,user TEXT,json TEXT)")
    db.run("CREATE TABLE users (id TEXT,password TEXT,json TEXT)")
*/



mList.forEach(m=> {
    if(m.type === 'router') {
        app.use(m.baseUrl,m.router);
    }
}) 
app.listen(config.port||3000);

