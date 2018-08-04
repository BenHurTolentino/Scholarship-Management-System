var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var func = require('../auth/functions/transactions');
var db = require('../../lib/database')();

router.route('/')
    .get(func.getScholarship,(req,res)=>{
        res.locals.PanelTitle = "Budget";
        db.query(`call budget_info()`,(err,results,field)=>{
            return res.render('budget/views/budget',{programs:req.scholarship,budgets:results[0]});
        })
    })
    .post(func.getBGId,func.slots_excess,(req,res)=>{     
        db.query(`INSERT INTO tblbudget 
        VALUES(${req.BGId},'${req.body.stype}','${req.body.budget}','${req.excess}','${req.slots}',CURDATE(),0)`,(err,results,field)=>{
            if(err) throw err;
            return res.redirect('/budget');
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
exports.budget = router;