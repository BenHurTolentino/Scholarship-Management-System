var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var db = require('../../lib/database')();

//functions
function getBId(req,res,next){
    db.query(`SELECT max(intBarangayId) as intBarangayId FROM tblbarangay`,(err,results,field)=>{
        if(results>1){
            req.id = 1;
        }
        else{
            req.id = results[0].intBarangayId+1;
        }
        return next();
    })
}
function getSTId(req,res,next){
    db.query(`SELECT max(intSTId) as intSTId FROM tblscholarshiptype`,(err,results,field)=>{
        if(results>1){
            req.id = 1;
        }
        else{
            req.id = results[0].intSTId+1;
        }
        return next();
    })
}
function getCId(req,res,next){
    db.query(`SELECT max(intCourseId) as intCourseId FROM tblcourse`,(err,results,field)=>{
        if(results>1){
            req.id = 1;
        }
        else{
            req.id = results[0].intCourseId+1;
        }
        return next();
    })
}
function getBTId(req,res,next){
    db.query(`SELECT max(intBatchId) as intBatchId FROM tblbatch`,(err,results,field)=>{
        if(results>1){
            req.id = 1;
        }
        else{
            req.id = results[0].intBatchId+1;
        }
        return next();
    })
}

//data manipulation and routing
router.route('/school')
    .get((req,res)=>{
        res.render('maintenance/views/m-school');
    })
router.route('/scholarship')
    .get((req,res)=>{
        db.query(`SELECT * FROM tblscholarshiptype WHERE isActive=1`,(err,results,field)=>{
            if(err) throw err;
            return res.render('maintenance/views/m-scholarship',{stypes:results});
        })
    })
    .post(getSTId,(req,res)=>{
        db.query(`INSERT INTO tblscholarshiptype
        VALUES(${req.id},"${req.body.STname}",1)`,(err,results,field)=>{
            if(err) throw err;
            return res.redirect('/maintenance/scholarship');
        })
    })
    .put((req,res)=>{
        db.query(`UPDATE tblscholarshiptype SET
        strSTDesc = "${req.body.STname}"
        WHERE intSTId = ${req.body.STId}`,(err,results,field)=>{
            if(err) throw err;
            return res.redirect('/maintenance/scholarship');
        })
    })
router.get('/scholarship/:intSTId',(req,res)=>{
    db.query(`UPDATE tblscholarshiptype SET
    isActive = 0
    WHERE intSTId = ${req.params.intSTId}`,(err,results,field)=>{
        if(err) throw err;
        return res.redirect('/maintenance/scholarship');
    })
})

router.route('/barangay')
    .get((req,res)=>{
        db.query(`SELECT * FROM tblbarangay WHERE isActive=1`,(err,results,field)=>{
            if(err) throw err;
            return res.render('maintenance/views/m-barangay',{barangays:results});
        })
    })
    .post(getBId,(req,res)=>{
        db.query(`INSERT INTO tblbarangay
        VALUES(${req.id},"${req.body.district}","${req.body.Bname}",1)`,(err,results,field)=>{
            if(err) throw err;
            return res.redirect('/maintenance/barangay');
        })
    })
    .put((req,res)=>{
        db.query(`UPDATE tblbarangay SET
        strBarangayName = "${req.body.Bname}",
        intDistrictId = "${req.body.district}"
        WHERE intBarangayId = ${req.body.BId}`,(err,results,field)=>{
            if(err) throw err;
            return res.redirect('/maintenance/barangay');
        })
    })
router.get('/barangay/:intBarangayId',(req,res)=>{
    db.query(`UPDATE tblbarangay SET
    isActive = 0
    WHERE intBarangayId = ${req.params.intBarangayId}`,(err,results,field)=>{
        if(err) throw err;
        return res.redirect('/maintenance/barangay');
    })
})

router.route('/course')
    .get((req,res)=>{
        db.query(`SELECT * FROM tblcourse WHERE isActive=1`,(err,results,field)=>{
            if(err) throw err;
            return res.render('maintenance/views/m-course',{courses:results});
        })
    })
    .post(getCId,(req,res)=>{
        db.query(`INSERT INTO tblcourse
        VALUES(${req.id},"${req.body.Cname}",1)`,(err,results,field)=>{
            if(err) throw err;
            return res.redirect('/maintenance/course');
        })
    })
    .put((req,res)=>{
        db.query(`UPDATE tblcourse SET
        strCourseName = "${req.body.Cname}"
        WHERE intCourseId = ${req.body.CId}`,(err,results,field)=>{
            if(err) throw err;
            return res.redirect('/maintenance/course');
        })
    })
router.get('/course/:intCourseId',(req,res)=>{
    db.query(`UPDATE tblcourse SET
    isActive = 0
    WHERE intcourseId = ${req.params.intCourseId}`,(err,results,field)=>{
        if(err) throw err;
        return res.redirect('/maintenance/course');
    })
})
router.route('/batch')
    .get((req,res)=>{
        db.query(`SELECT * FROM tblbatch WHERE isActive=1`,(err,results,field)=>{
            if(err) throw err;
            return res.render('maintenance/views/m-batch',{batches:results});
        })
    })
    .post(getBTId,(req,res)=>{
        db.query(`INSERT INTO tblbatch VALUES(${req.id},"${req.body.Bname}",1)`,(err,results,field)=>{
            if(err) throw err;
            return res.redirect('/maintenance/batch');
        })
    })
    .put((req,res)=>{
        db.query(`UPDATE tblbatch SET
        strBatchDesc = "${req.body.Bname}"
        WHERE intBatchId = ${req.body.BId}`,(err,results,field)=>{
            if(err) throw err;
            return res.redirect('/maintenance/batch');
        })
    })
router.get('/batch/:intBatchId',(req,res)=>{
    db.query(`UPDATE tblbatch SET
    isActive = 0
    WHERE intBatchId = ${req.params.intBatchId}`,(err,results,field)=>{
        if(err) throw err;
        return res.redirect('/maintenance/batch');
    })
})

exports.maintenance = router;