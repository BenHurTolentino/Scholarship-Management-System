var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var db = require('../../lib/database')();
var func = require('../auth/functions/transactions');
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
exports.transaction = router;