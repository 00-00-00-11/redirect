var express = require('express')
var router = express.Router()
const h = require("../../lib/helpers")
const c = require("../../config")
var db = require("../../index.js").db


    router.post("/newLink",(req,res) => {
        let url = req.body.url
        let id = req.body.id
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
                return res.redirect(`/user/manage/?id=${id}`)
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
        let category = req.body.category || "none"
        if(!id || !link ||!req.session.user) return res.redirect(h.message({e_line:"error",e_message:"not enough amounts of required fields passed",back:c.host}))
        db.all(`SELECT * FROM links WHERE id="${id}" AND user="${req.session.user.id}"`,(e,row) => {
            row = row[0]
            if(!row) return res.redirect(h.message({e_line:"error",e_message:"something went wrong, sorry!",back:c.host}))
            let linkObject = {
                user: req.session.user,
                clicks: row.clicks,
                category: category,
                protected: {
                    on:password?true:false,
                    password:password
                }
            }

            db.run(`UPDATE links SET id="${id}", link="${link}",json='${JSON.stringify(linkObject)}'`)
            return res.redirect("/user/u/manage")
        })
    })


module.exports = {
    type: 'router',
    baseUrl: '/api/l',
    router:router
}
