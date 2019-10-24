var express = require('express')
var router = express.Router()
var path = require("path")
var db = require("../../index").db

router.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, "../../front","main.html"));
})

router.get('/message', (req,res) => {
    res.sendFile(path.join(__dirname, "../../front","message.html"));
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
        if(jData.protected.on && !password) return res.redirect(`/auth?return=${req.params.id}`)
        else if(jData.protected.on && jData.protected.password != password) return res.redirect("/message/?back=http://localhost:3000&type=error&message=wrong password")
        res.redirect(row.link)
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
