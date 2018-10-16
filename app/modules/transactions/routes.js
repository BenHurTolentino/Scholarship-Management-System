var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var db = require('../../lib/database')();
var func = require('../auth/functions/transactions');
var mailer = require('../auth/functions/mailer');
var logic = require('./logic/trasaction-logic');
var matchMiddleware = require('../auth/middlewares/matcher');

router.use(matchMiddleware.match);
router.post('/match',logic.match,(req,res)=>{
    if(req.check == 1){
        return res.send('success')
    }
    return res.send('error');
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

router.route('/application/sponsor')
    .get((req,res)=>{
        res.locals.PanelTitle='Application';
        db.query(`SELECT * FROM tblscholarshiptype join tblusers on (intSchTypeId = intSTId) 
        WHERE enumUserType = 3 AND enumStatus = 'P'`,(err,results,field)=>{
            return res.render('transactions/views/t-sponsorapply',{sponsors:results});
        })
    })
    .post((req,res)=>{
        db.query(`UPDATE tblscholarshiptype SET
        enumStatus = 'A'
        WHERE intSTId = ${req.body.sponsor};
        UPDATE tblusers SET
        isActive = 1
        WHERE strUserId = '${req.body.user}';
        SELECT * from tblusers WHERE strUserId = '${req.body.user}'`,(err,results,field)=>{
            if(err) return res.send(err);
            
            var content = `
            <p>This is to inform you that the Scholarship Management System has accepted your application for a sponsorship</p>
            <p>If you have any further questions regarding the admission or scholarship procedure, please message or call the coordinator. Our program takes pride in excellent results and producing dynamic scholars.</p>
            <p>Thanking you and Good day!</p>
            <hr>
            <p style="color: rgba(0, 0, 0, 0.3);font-size: 16pt;"><i> *** THIS IS A SYSTEM GENERATED EMAIL.  PLEASE DO NOT REPLY TO THIS MESSAGE. *** </i></p>`
            var subject = 'Sponsorship Application';
            var receiver = results[2][0].strUserEmail;
            mailer.mail(content,receiver,subject);

            return res.send('success');
        })
    })
    .put((req,res)=>{
        db.query(`UPDATE tblscholarshiptype SET
        enumStatus = 'D'
        WHERE intSTId = ${req.body.sponsor}`,(err,results,field)=>{
            if(err) return res.send(err);
            return res.send('success');
        })
    })
exports.transaction = router;