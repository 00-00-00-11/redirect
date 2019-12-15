var express = require('express')
var router = express.Router()
var path = require("path")
var db = require("../../index").db

router.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, "../../front","main.html"));
})

router.get("/auth",(req,res) => {
    res.sendFile(path.join(__dirname, "../../front","auth.html"));
})

router.get("/:id",(req,res,next) => {
    if(!req.params.id) return next()
    let password = req.query.password
    db.all(`SELECT * FROM links WHERE id="${req.params.id}"`,(e,rows) => {
        let row = rows[0]
        if(!row) return next()
        let jData = JSON.parse(row.json)
        jData.clicks += 1
        if(jData.protected.on && !password) return res.redirect(`/auth?return=${req.params.id}`)
        else if(jData.protected.on && jData.protected.password != password) return res.send({type:"error",data:"wrong credentials"})
        res.redirect(row.link)
        db.run(`UPDATE links SET json='${JSON.stringify(jData)}' WHERE id="${req.params.id}"`)
    })
})


router.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname, "../../front","404.html"));
})

module.exports = {
    type: 'router',
    baseUrl: '/',
    router:router
}
