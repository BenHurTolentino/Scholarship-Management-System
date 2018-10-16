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

function userinfo(req,res,next){
    db.query(`SELECT * FROM tblusers join tblstudentdetails on intStudentId = intUStudId WHERE strUserId = '${req.session.user.strUserId}'`,(err,results,field)=>{
        res.locals.userNum = results[0].strUserId;
        res.locals.user = results[0].strStudentFname+' '+results[0].strStudentLname
        return next();
    })
}


router.use(authMiddleware.hasAuth,userinfo)


router.route('/')
.get((req,res)=>{
    res.locals.PanelTitle='News Feed';
    res.render('user/views/home');
})
router.route('/profile')
.get((req,res)=>{
    res.locals.PanelTitle='User Profile';
    db.query(`SELECT * FROM tblusers WHERE strUserId = '${req.session.user.strUserId}'`,(err,results)=>{
        return res.render('user/views/profile',{coordinator:results[0]});
    })
})
.put((req,res)=>{
    console.log(req.body);  
    db.query(`UPDATE tblusers SET
    strUserEmail = ?,
    strUserPassword = ?
    WHERE strUserId = ?`,[req.body.email,req.body.password,req.body.id],(err,results,field)=>{
        if(err) throw err;
        return res.send('success');
    })
})
router.route('/message')
.get(func.users,(req,res)=>{
    var i = 0;
    res.locals.PanelTitle='Messages';
    db.query(`SELECT * FROM tblmessage WHERE strMReceiverId = '${req.session.user.strUserId}'`,(err,results)=>{
        if(err) throw err;
        results.forEach(ress=>{
            results[i].datMDate = moment(results[i].datMDate).format('MMM D, YYYY');
        })
        return res.render('user/views/message',{users:req.users,messages:results});
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
    res.render('user/views/sentmail');
})
router.route('/request')
    .get(func.Ucourse,(req,res)=>{
        console.log(req.Ucourse)
        res.locals.PanelTitle='Shift Request';
        console.log(req.session.user)
        db.query(`SELECT * FROM tblsponsorcourse join (tblcourse) on (intSCourseId = intCourseId) WHERE intSponsorId = ${req.session.user.intSchTypeId} AND intSCourseId != ${req.Ucourse}`,(err,results,field)=>{
            return res.render('user/views/request',{courses:results});
        })
    })
    .post((req,res)=>{
        db.query(`INSERT INTO tblrequest(strRUserId,intRCourseId,strReason) 
        VALUES('${req.session.user.strUserId}',${req.body.course},'${req.body.reason}')`,(err,results)=>{
            if(err) throw err
            return res.send('success');
        })
    })


exports.user = router;