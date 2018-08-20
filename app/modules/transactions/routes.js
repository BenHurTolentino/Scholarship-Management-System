var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var db = require('../../lib/database')();
var func = require('../auth/functions/transactions');

router.route('/renewal')
    .get((req,res)=>{
        res.locals.PanelTitle='Renewal';
        res.render('transactions/views/t-renewal');
    })

router.post('/requirements',func.getRequirement,func.getARId,(req,res)=>{
    for(var i=0;i<req.scholar.length;i++){
        db.query(`INSERT INTO tblstudentreq 
        VALUES(${req.ARId},${req.body.Sid},${req.scholar[i].intSRId},0)`,(err,results,field)=>{
            if(err) throw err;
        })
        req.ARId+=1;
    }
    return res.redirect('/transaction/application');
    
});
router.post('/studinfo',(req,res)=>{
    db.query(`call student_info(${req.body.id})`,(err,results,field)=>{
        res.json(results[0][0]);
    })
})
router.get('/application',func.getScholarship,(req,res)=>{
    res.locals.PanelTitle='Application';
    db.query(`call student_apply();`,(err,results,field)=>{
        return res.render('transactions/views/t-application',{applicants:results[0],programs:req.scholarship});
    })
});

    



exports.transaction = router;