var express = require('express')
var router = express.Router()
var path = require("path")
const bc = require("bcrypt");
const db = require("../../index").db
const h = require("../../lib/helpers")
const c = require("../../config")
//TODO: document this file


//vars needed for crypt


    router.get("/login",(req,res) => {
        res.sendFile(path.join(__dirname, "../../front/","login.html"));
    })

    router.post("/newUser",(req,res) => {
        const saltRounds = 5;
        const id = req.body.id
        const password = req.body.password
        if(!id||!password) return res.redirect(h.message(res,{e_line:"account error",e_message:"could not create account since required params are missing",back:c.host}))
        db.all(`SELECT * FROM users WHERE id="${id}"`,(err,row) => {
            if(row && row.length != 0) {
                return res.redirect(h.message(res,{e_line:"account error",e_message:"username taken!",back:c.host}))
            } else {
                bc.genSalt(saltRounds,(err,salt) => {
                    if(err) return res.redirect(h.message(res,{e_line:"database error",e_message:"could not generate salt",back:c.host}))
                    bc.hash(password,salt,(err, hash) => {
                        if(err) return res.redirect(h.message(res,{e_line:"crypt error",e_message:"could not hash password",back:c.host}))
                        const uObj = {
                            perms: c.admins.includes(id) ? 100 : 0
                        }
                        db.run(`INSERT INTO users VALUES ("${id}","${hash}",'${JSON.stringify(uObj)}')`,)
                        h.log(`user created with username "${id}"`)
                        res.redirect("/user/login")
                    })
                })
            }
        })
    })

    router.post("/login",(req,res) => {
        const id = req.body.id
        const password = req.body.password
        if(!id||!password) return res.redirect(h.message({e_line:"authentication error",e_message:"could not login to account since required params are missing",back:c.host}))
        db.all(`SELECT * FROM users WHERE id="${id}"`,(err,row) => {
            row = row[0]
            if(!row) return res.redirect(h.message({e_line:"account error",e_message:"invalid username/password",back:c.host}))
            bc.compare(password,row.password,(err,comparedBool) => {
                if(err || !comparedBool) return res.redirect(h.message({e_line:"account error",e_message:"invalid username/password",back:c.host}))
                req.session.user = {
                    id:row.id,
                    data:JSON.parse(row.json)
                }
                return res.redirect(h.message({e_line:"logged in!",e_message:"click button to go to management page",back:`${c.host}/user/u/manage`}))
            })
        })
    })

    router.use("/u/",(req,res,next) => {
        if(!req.session || !req.session.user) return res.redirect("/user/login")
        next()
    })

    router.get("/u/getLinks",(req,res) => {
            db.all(`SELECT * FROM links ${req.session.user.data.perms >= c.perms.administrator ? "" : `WHERE user = "${req.session.user.id}"`}`,(err,rows) => {
                if(err) return res.redirect(h.message({e_line:"db err",e_message:"database query went wack",back:`${c.host}/user/u/manage`}))
                res.send(rows)
            })
    })

    const runCommand = (c,args,req) => {
        if(!c || !args) return {type:"error",line:">:("}
        let cmd
        try {
        cmd = require(`../../commands/${c}.js`)
        } catch(e) {
            return {
                type:"error",
                line: `no such command "${c}"`
            }
        }
            if(!cmd || !cmd.meta || !cmd.run) return {type:"cmdError",line:"command format wrong"}
            if(cmd.meta.requiredLevel > req.session.user.data.perms) return {type:"authError",line:`command "${c}" requires perm level ${cmd.meta.requiredLevel} but you only have ${req.session.user.data.perms}`}
            try {
                let ans = cmd.run(args)
                return ans
            } catch(e) {
                return {
                    type:"cmdError",
                    line:e.message
                }
            }


    }

    router.get("/u/runCommand",(req,res) => {
        let command = req.query.command
        let args = req.query.params.split(",")
        if(!command || !args) return res.send ({
            type:"error",
            line:"not enough query params passed"
        })
        let cmd = runCommand(command,args,req)
        return res.send({
            type:cmd.type,
            line: cmd.line
        })
    })

    router.get("/u/manage",(req,res) => {
        res.sendFile(path.join(__dirname, "../../front/","manage.html"));
    })



module.exports = {
    type: 'router',
    baseUrl: '/user/',
    router:router,
    requiredPackages: ["bcrypt"]
}
