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
        WHERE strUserId = '${req.body.user}'`,(err,results,field)=>{
            if(err) return res.send(err);
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