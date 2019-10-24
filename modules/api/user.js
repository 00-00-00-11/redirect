var express = require('express')
var router = express.Router()
var path = require("path")
const bc = require("bcrypt");
const db = require("../../index").db

//vars needed for crypt


    router.get("/login",(req,res) => {
        res.sendFile(path.join(__dirname, "../../front/","login.html"));
    })

    router.post("/newUser",(req,res) => {
        const saltRounds = 5;
        const id = req.body.id
        const password = req.body.password
        if(!id||!password) return res.redirect(`/message/?back=/user/login&type=login error&message=could not create your account since you failed to pass all needed params`)
        db.all(`SELECT * FROM users WHERE id="${id}"`,(err,row) => {
            if(row && row.length != 0) {
                return res.redirect(`/message/?back=/user/login&type=login error&message=username taken`)
            } else {
                bc.genSalt(saltRounds,(err,salt) => {
                    if(err) return res.redirect(`/message/?back=https://en.wikipedia.org/wiki/Salt&type=salt error&message=could not generate salt... but that does not stop you from trying`)
                    bc.hash(password,salt,(err, hash) => {
                        if(err) return res.redirect(`/message/?back=/user/login&type=hash error&message=could not generate password hash`)
                        const uObj = {
                            perms: 0
                        }
                        db.run(`INSERT INTO users VALUES ("${id}","${hash}",'${JSON.stringify(uObj)}')`,)
                        res.redirect("/user/login")
                    })
                })
            }
        })
    })

    router.post("/login",(req,res) => {
        const id = req.body.id
        const password = req.body.password
        if(!id||!password) return res.redirect(`/message/?back=/user/login&type=login error&message=could not authorise your account since you failed to pass all needed params`)
        db.all(`SELECT * FROM users WHERE id="${id}"`,(err,row) => {
            row = row[0]
            if(!row) return res.redirect(`/message/?back=/user/login&type=login error&message=invalid password/username`)
            bc.compare(password,row.password,(err,comparedBool) => {
                if(err || !comparedBool) return res.redirect(`/message/?back=/user/login&type=login error&message=invalid password/username`)
                req.session.user = {
                    id:row.id,
                    data:JSON.parse(row.json)
                }
                return res.redirect(`/message/?back=/user/u/manage&type=logged in!&message=click button below to go to manage page`)
            })
        })
    })

    router.use("/u/",(req,res,next) => {
        if(!req.session || !req.session.user) return res.redirect("/user/login")
        next()
    })

    router.get("/u/getLinks",(req,res) => {
        db.all(`SELECT * FROM links WHERE user = "${req.session.user.id}"`,(err,rows) => {
            if(err) return res.redirect("/message/?back=/user/u/manage&type=data fetch error&message=database query went wack")
            res.send(rows)
        })
    })

    router.get("/u/manage",(req,res) => {
        res.sendFile(path.join(__dirname, "../../front/","manage.html"));
        
    })



module.exports = {
    type: 'router',
    baseUrl: '/user/',
    router:router
}
