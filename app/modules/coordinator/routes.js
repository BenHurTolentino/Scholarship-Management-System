var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var db = require('../../lib/database')();
var func = require('../auth/functions/transactions');
const smart = require('../auth/functions/smart');
const dash = require('../auth/functions/dashboard')
var crypto = require('crypto');
var moment = require("moment")

router.use(authMiddleware.hasAuth,dash.applicant,dash.slots,dash.scholar);

router.route('/')
    .get((req,res)=>{
        res.locals.PanelTitle="Dashboard";
        res.render('coordinator/views/chome');
    })
function update(req,res,next){
    if(req.body.stat==1){
        db.query(`UPDATE tblclaim SET
            datDateClaimed = CURDATE()
            WHERE intClaimId = ${req.body.ClaimId}`,(err,results,field)=>{
                if(err) throw err;
                console.log("posted:claim");
                return next();
            })
    }
    else{
        db.query(`UPDATE tblclaim SET
            datDateClaimed = null
            WHERE intClaimId = ${req.body.ClaimId}`,(err,results,field)=>{
                if(err) throw err;
                console.log("posted:claim");
                return next();
            })
    }
}
router.route('/claiming')
    .get((req,res)=>{
        res.locals.PanelTitle="Claiming";
        db.query(`call student_claim()`,(err,results,fiel)=>{
            return res.render('coordinator/views/cclaiming',{claims:results[0]});
        })
    })
    .post(update,(req,res)=>{
        db.query(`call student_claim_one(${req.body.ClaimId})`,(err,results,field)=>{
            if(results[0][0].datDateClaimed!=null){
                results[0][0].datDateClaimed = moment(results[0][0].datDateClaimed).format('MMMM D YYYY')
            }
            res.json(results[0][0]);
        })
    })
router.route('/renewal')
    .get((req,res)=>{
        res.locals.PanelTitle="Renewal";
        res.render('coordinator/views/crenewal');
    })
router.route('/budget')
    .get(func.getScholarship,(req,res)=>{
        res.locals.PanelTitle = "Budget";
        db.query(`call budget_info()`,(err,results,field)=>{
            return res.render('coordinator/views/cbudget',{programs:req.scholarship,budgets:results[0]});
        })
    })
    .post(func.getBGId,func.slots_excess,(req,res)=>{     
        db.query(`INSERT INTO tblbudget 
        VALUES(${req.BGId},null,'${req.body.stype}','${req.body.budget}','${req.excess}','${req.slots}',CURDATE())`,(err,results,field)=>{
            if(err) throw err;
            return res.redirect('/coordinator/budget');
        });
    })
router.get('/application',(req,res)=>{
    res.locals.PanelTitle='Application';
    db.query(`call student_apply_scholarship(1);`,(err,results,field)=>{
        return res.render('coordinator/views/ct-application',{applicants:results[0]});
    })
})
router.get('/application/:intStudentId',func.getUserId,func.getStudent,(req,res)=>{
    // db.query(`UPDATE tblstudentdetails SET
    // enumStudentStat = 2
    // WHERE intStudentID = '${req.params.intStudentId}'`,(err,results,field)=>{
    //     if(err) throw err;
    //     res.redirect('/coordinator/application');
    // })
    if(req.user!=''){
        var id = smart.counter('student',req.session.user.intSchTypeId,req.user[0].strUserId);
    }
    else{
        var id = smart.counter('student',req.session.user.intSchTypeId,'');
    }
    var password = Math.random().toString(36).substr(2,8);
    var token = crypto.randomBytes(32).toString('hex');
    db.query(`INSERT INTO tblusers(strUserId,intUStudId,intSchTypeId,strUserEmail,strUserPassword,enumUserType,isActive,token) 
    VALUES('${id}',${req.params.intStudentId},${req.session.user.intSchTypeId},'${req.info[0].strStudentEmail}',"${password}",2,1,'${token}')`,(err,results,field)=>{
        if(err) throw err;
        console.log('USER ADDED');
        res.redirect('/coordinator/application');
    })
})
router.post('/studinfo',(req,res)=>{
    db.query(`call student_info(${req.body.id})`,(err,results,field)=>{
        res.json(results[0][0]);
    })
})
router.post('/query/requirement',(req,res)=>{
    db.query(`call applicant_requirements(${req.body.StudentId})`,(err,results,field)=>{
        res.send(results[0])
    });
});


exports.coordinator = router;