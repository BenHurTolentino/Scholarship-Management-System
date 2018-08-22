var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var db = require('../../lib/database')();
var func = require('../auth/functions/transactions');
const smart = require('../auth/functions/smart');
const dash = require('../auth/functions/dashboard')
var crypto = require('crypto');
var moment = require("moment")

router.use(authMiddleware.hasAuth,dash.dashboard);

router.route('/')
    .get((req,res)=>{
        res.locals.PanelTitle="Dashboard";
        res.locals.applicant=req.applicant;
        res.locals.budget=req.budget;
        res.locals.slots=req.slots;
        res.locals.scholar=req.scholar;
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
        var i=0;
        res.locals.PanelTitle="Claiming";
        db.query(`call student_claim()`,(err,results,fiel)=>{
            results[0].forEach(function(){
                if(results[0][i].datDateClaimed!=null){
                    results[0][i].datDateClaimed = moment(results[0][0].datDateClaimed).format('MMMM D,YYYY')
                    i++;
                }
            })
            return res.render('coordinator/views/cclaiming',{claims:results[0]});
        })
    })
    .post(update,(req,res)=>{
        db.query(`call student_claim_one(${req.body.ClaimId})`,(err,results,field)=>{
            if(results[0][0].datDateClaimed!=null){
                results[0][0].datDateClaimed = moment(results[0][0].datDateClaimed).format('MMMM D,YYYY')
            }
            res.json(results[0][0]);
        })
    })
router.route('/renewal')
    .get((req,res)=>{
        res.locals.PanelTitle="Renewal";
        db.query(`call student_renew_scholarship(1)`,(err,results,field)=>{
            if(err) throw err;
            console.log(results[0]);
            return res.render('coordinator/views/crenewal',{students:results[0]});
        })
    })



router.route('/budget')
    .get(func.getScholarship,(req,res)=>{
        res.locals.PanelTitle = "Budget";
        var i=0;
        db.query(`call budget_info(${req.session.user.intSchTypeId})`,(err,results,field)=>{
            results[0].forEach(res=>{
                results[0][i].dblAmount=(results[0][i].dblAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                i++;
            })
            return res.render('coordinator/views/cbudget',{programs:req.scholarship,budgets:results[0]});
        })
    })
    .post(func.getBGId,func.slots_excess,(req,res)=>{     
        db.query(`INSERT INTO tblbudget 
        VALUES(${req.BGId},'${req.body.stype}','${req.body.budget}','${req.excess}','${req.slots}',CURDATE(),0)`,(err,results,field)=>{
            if(err) throw err;
            return res.redirect('/coordinator/budget');
        });
    })
router.get('/approve/:intBudgetId',(req,res)=>{
    db.query(`UPDATE tblbudget SET
    isApprove = 1
    WHERE intBudgetId = ${req.params.intBudgetId}`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/budget');
    })
})
router.get('/application',(req,res)=>{
    res.locals.PanelTitle='Application';
    db.query(`call student_apply_scholarship(1);`,(err,results,field)=>{
        return res.render('coordinator/views/ct-application',{applicants:results[0]});
    })
})
function CreateUser(req,res,next){
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
        return next();
    })
}
router.get('/application/:intStudentId',func.getUserId,func.getStudent,CreateUser,func.getCId,(req,res)=>{
    db.query(`UPDATE tblstudentdetails SET
    enumStudentStat = 2
    WHERE intStudentID = '${req.params.intStudentId}'`,(err,results,field)=>{
        if(err) throw err;  
    });
    db.query(`INSERT INTO tblclaim(intClaimId,intCStudId,enumBudget) 
    VALUES(${req.CId},${req.params.intStudentId},1)`,(err,results,field)=>{
        if(err) throw err;
    })

    res.redirect('/coordinator/application');
})
router.get('/renewal/:intStudentId',func.getCId,(req,res)=>{
    db.query(`UPDATE tblstudentdetails SET
    isRenewal = 0
    WHERE intStudentID = '${req.params.intStudentId}'`,(err,results,field)=>{
        if(err) throw err;  
    });
    db.query(`INSERT INTO tblclaim(intClaimId,intCStudId,enumBudget) 
    VALUES(${req.CId},${req.params.intStudentId},2)`,(err,results,field)=>{
        if(err) throw err;
    })

    res.redirect('/coordinator/renewal');
})


router.post('/studinfo',(req,res)=>{
    db.query(`call student_info(${req.body.id})`,(err,results,field)=>{
        res.json(results[0][0]);
    })
})

router.post('/requirements',(req,res)=>{
    req.body.files.forEach(file => {
        db.query(`UPDATE tblstudentreq SET
        isSubmitted = 1 
        WHERE intARId = ${file}`,(err,results,field)=>{
            if(err) throw err;    
        })
    });
    res.redirect('/coordinator/application');
})
router.post('/requirements/renew',(req,res)=>{
    req.body.files.forEach(file => {
        db.query(`UPDATE tblstudentreq SET
        isSubmitted = 1 
        WHERE intARId = ${file}`,(err,results,field)=>{
            if(err) throw err;    
        })
    });
    res.redirect('/coordinator/renewal');
})
router.post('/query/apply',(req,res)=>{
    db.query(`call applicant_requirements(${req.body.StudentId})`,(err,results,field)=>{
        res.send(results[0])
    });
});
router.post('/query/renew',(req,res)=>{
    db.query(`call scholar_requirements(${req.body.StudentId})`,(err,results,field)=>{
        res.send(results[0])
    });
});


exports.coordinator = router;