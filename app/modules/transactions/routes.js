var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var db = require('../../lib/database')();
var func = require('../auth/functions/transactions');

function putIcon(req,res,next){
    res.locals.PanelIcon='layers'
    return next();
}

router.use(putIcon);

router.get('/application',func.requirements,func.applyreq,(req,res)=>{
    res.locals.PanelTitle='Application';
    db.query(`call student_apply();`,(err,results,field)=>{
        return res.render('transactions/views/t-application',{applicants:results[0],requirements:req.requirements});
    })
})
router.post('/query/requirement',(req,res)=>{
    db.query(`call applicant_requirements(${req.body.StudentId})`,(err,results,field)=>{
        console.log(results[0]);
        res.json(results[0]);
    });
})
router.post('/query/requirement',(req,res)=>{
    db.query(`call applicant_requirements(${req.body.StudentId})`,(err,results,field)=>{
        console.log(results[0]);
        res.json(results[0]);
    });
})



router.get('/application/:intStudentId',(req,res)=>{
    db.query(`UPDATE tblstudentdetails SET
    enumStudentStat = 2
    WHERE intStudentID = '${req.params.intStudentId}'`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/transaction/application');
    })
})
router.post('/requirements/:intStudentId',(req,res)=>{
    for(var i=0;i<req.body.files.length;i++){
        db.query(`UPDATE tblapplicantreq SET 
        isSubmitted = 1 
        WHERE intARStudId = ${req.body.student} AND intARRId = ${req.body.files[i]}`,(err,results,field)=>{
            if(err) throw err;
        });
    }
    res.redirect('/transaction/application');
})
    



exports.transaction = router;