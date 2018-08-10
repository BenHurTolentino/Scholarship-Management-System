var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var db = require('../../lib/database')();
var func = require('../auth/functions/transactions');

router.route('/')
    .get((req,res)=>{
        res.locals.PanelTitle="Dashboard";
        res.render('coordinator/views/chome');
    })
router.route('/claiming')
    .get((req,res)=>{
        res.locals.PanelTitle="Claiming";
        res.render('coordinator/views/cclaiming');
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
router.get('/application/:intStudentId',(req,res)=>{
    db.query(`UPDATE tblstudentdetails SET
    enumStudentStat = 2
    WHERE intStudentID = '${req.params.intStudentId}'`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/coordinator/application');
    })
})


exports.coordinator = router;