var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var db = require('../../lib/database')();
var func = require('../auth/functions/transactions');
var moment = require('moment')
var nodemailer = require('nodemailer');
router.post('/requirements',func.getRequirement,func.getARId,(req,res)=>{
    for(var i=0;i<req.scholar.length;i++){
        db.query(`INSERT INTO tblstudentreq 
        VALUES(${req.ARId},${req.body.Sid},${req.scholar[i].intSRId},0)`,(err,results,field)=>{
            if(err) throw err;
        })
        req.ARId+=1;
    }
    db.query(`SELECT * FROM tblscholarshipreq JOIN(tblrequirements) ON (intSRRId = intRequirementId) WHERE intSRSTID=${req.body.stype} AND enumReqType=1;
    SELECT strSTDesc FROM tblscholarshiptype WHERE intSTId = ${req.body.stype};
    SELECT strStudentEmail FROM tblstudentdetails WHERE intStudentId = ${req.body.Sid};`,(err,results,field)=>{
        var requirements="";
        var x=0;
        results[0].forEach(function(){
            requirements += `<li><b>${results[0][x].strRequirementDesc}</b></li>\n`
            x++
        });
          
        
        var date = moment().add(14,'day').format('MMMM D,YYYY');
        var content = `<p style="font-size: 12pt;">Greetings! This is Scholarship Management System. You have been assigned to <b>${results[1][0].strSTDesc}</b> scholarship and the following are your requirements:</p>
        <ol style="font-size: 10pt;">
        ${requirements}
        </ol>
        <p style="font-size: 12pt;"> You have until <b>${date}</b> to submit the following. Please be informed of the strict deadline.</p>
        <hr>
        <p style="color: rgba(0, 0, 0, 0.3);font-size: 16pt;"><i> *** THIS IS A SYSTEM GENERATED EMAIL.  PLEASE DO NOT REPLY TO THIS MESSAGE. *** </i></p>`
        
        var transporter = nodemailer.createTransport({
            service : 'gmail',
            auth : {
                user:'ganilayow@gmail.com',
                pass:'mastersensei'
            }
        });
        const mailOptions = {
            from: '"Scholarship Management System" <ganilayow@gmail.com>',
            to: results[2][0].strStudentEmail,
            subject: 'Scholarship Application',
            html: content
        }
        transporter.sendMail(mailOptions,function(err,info){
            if(err)
                console.log(err);
            else
                console.log(info);
        });
        
    })
    return res.redirect('/transaction/application');
    
});
router.post('/studinfo',(req,res)=>{
    db.query(`call student_info(${req.body.id})`,(err,results,field)=>{
        res.json(results[0][0]);
    })
})
router.get('/application',func.getScholarship_apply,(req,res)=>{
    res.locals.PanelTitle='Application';
    db.query(`call student_apply();`,(err,results,field)=>{
        return res.render('transactions/views/t-application',{applicants:results[0],programs:req.scholarship});
    })
});

    



exports.transaction = router;