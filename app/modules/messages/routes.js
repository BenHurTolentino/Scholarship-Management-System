var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var db = require('../../lib/database')();
var func = require('../auth/functions/transactions');
const smart = require('../auth/functions/smart');
const dash = require('../auth/functions/dashboard')
const checker = require('../auth/functions/checker')
var crypto = require('crypto');
var moment = require("moment");
var nodemailer = require('nodemailer');
var matchMiddleware = require('../auth/middlewares/matcher');

router.route('/inbox')
    .get(func.users,(req,res)=>{
        res.locals.PanelTitle='Messages';
        db.query(`SELECT * FROM tblmessage WHERE strMReceiverId = '${req.session.user.strUserId}'`,(err,results)=>{
            if(err) throw err;
            return res.render('coordinator/views/cinbox',{users:req.users,messages:results});
        })
    })
    .post((req,res)=>{
        db.query(`INSERT INTO tblmessage(strMUserId,strMReceiverId,strMSubject,strMContent,datMDate) 
        VALUES(?,?,?,?,?)`,[req.session.user.strUserId,req.body.receiver,req.body.subject,req.body.content,moment().format('YYYY-MM-DD')],(err,results,field)=>{
            if(err) throw err;
            return res.send('success');
        })
    })

router.route('/sentmail')
.get((req,res)=>{
    res.locals.PanelTitle='Messages';
    res.render('messages/views/sent');
})



exports.messages = router;