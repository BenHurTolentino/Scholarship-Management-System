var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var db = require('../../lib/database')();

function putIcon(req,res,next){
    res.locals.PanelIcon='layers'
    return next();
}

router.use(putIcon);

router.get('/application',(req,res)=>{
    res.locals.PanelTitle='Application';
    db.query(`call student_apply();`,(err,results,field)=>{
        var ID = [];
        for(var i=0;i<results[0].length;i++){
            ID[i]=results[0][i].intStudentId;
            console.log(ID[i]);
        }
        return res.render('transactions/views/t-application',{applicants:results[0]});
    })
})
router.get('/application/:intStudentId',(req,res)=>{
    db.query(`UPDATE tblstudentdetails SET
    enumStudentStat = 2
    WHERE intStudentID = '${req.params.intStudentId}'`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/transaction/application');
    })
})
    



exports.transaction = router;