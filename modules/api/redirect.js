var express = require('express')
var router = express.Router()
const h = require("../../lib/helpers")
const c = require("../../config")
var db = require("../../index.js").db
//TODO: document this file

    router.post("/newLink",(req,res) => {
        let url = req.body.url
        let id = req.body.id
        if(!url || !id) return res.redirect(h.message({e_line:"error",e_message:"not enough params passed",back:"/"}))
        db.all(`SELECT * FROM links where id="${id}"`,(e,row) => {
            if(!row || row.length === 0) {
                let linkObject = {
                    user: req.session.user ? req.session.user.id : "none",
                    clicks: 0,
                    category: "none",
                    protected: {
                        on:false,
                        password:null
                    }
                }
                db.run(`INSERT INTO links VALUES ("${id}","${url}","${linkObject.user}",'${JSON.stringify(linkObject)}')`)
                h.log(`redirect created with id "${id}"`)
                return res.redirect(h.message({e_line:`link created!`,e_message:`link ${c.host}/${id} created!`,back:c.host}))
            } else {
                return res.redirect(h.message({e_line:"error",e_message:"redirect with identical id already exists",back:c.host}))
            }
        })
    })


    router.post("/edit",(req,res) => {
        if(!req.session.user) return res.redirect(h.message({e_line:"error",e_message:"no session exists for you",back:c.host}))
        let id = req.body.id
        let link = req.body.link
        let password = req.body.password
        if(!id || !link ||!req.session.user) return res.send("ERROR")
        db.all(`SELECT * FROM links WHERE id="${id}" ${req.session.user.data.perms >= c.perms.administrator ? "" : `AND user="${req.session.user.id}`}`,(e,row) => {
            row = row[0]
            if(!row) return res.send("ERROR")
            let linkObject = {
                user: req.session.user,
                clicks: row.clicks,
                protected: {
                    on:password?true:false,
                    password:password
                }
            }

            db.run(`UPDATE links SET id="${id}", link="${link}",json='${JSON.stringify(linkObject)}' WHERE id="${id}"`)
            return res.send("OK")
        })
    })

    router.get("/fetchInfo/:link",(req,res) => {
        if(!req.params.link) return res.send(">:(")
        db.all(`SELECT * FROM links WHERE id="${req.params.link}"`,(e,rows) => {
            if(e) {
                h.log(e,h.logTypes.error)
                return res.send("lol error")
            }
            let row = rows[0]
            if(!row) return res.send("no such link")
            let jData = JSON.parse(row.json)
            if(jData.protected.on) return res.send("this link is protected.")
            else res.send(row)
        })
    })
router.get("/delete",(req,res) => {
    let id = req.query.id
    if(!id) return res.send("ERROR:no id passwed")
    if(!req.session||!req.session.user) return res.send("ERROR:no session")
        db.run(`DELETE FROM links WHERE id="${id}" ${req.session.user.data.perms >= c.perms.administrator ? "" : `AND user="${req.session.user.id}"`}`,(e) => {
            if(e) return res.send("ERROR:db querying error")
            else res.send("OK")
        })

})


module.exports = {
    type: 'router',
    baseUrl: '/api/l',
    router:router
}
