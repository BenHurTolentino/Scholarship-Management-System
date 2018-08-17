var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var db = require('../../lib/database')();
var func = require('../auth/functions/transactions');

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
function getSCHId(req,res,next){
    db.query(`SELECT max(intSchoolId) as intSchoolId FROM tblschool`,(err,results,field)=>{
        if(results>1){
            req.id = 1;
        }
        else{
            req.id = results[0].intSchoolId+1;
        }
        return next();
    })
}
function getRId(req,res,next){
    db.query(`SELECT max(intRequirementId) as intRequirementId FROM tblrequirements`,(err,results,field)=>{
        if(results>1){
            req.id = 1;
        }
        else{
            req.id = results[0].intRequirementId+1;
        }
        return next();
    })
}
function getDId(req,res,next){
    db.query(`SELECT max(intDistrictId) as intDistrictId FROM tbldistrict`,(err,results,field)=>{
        if(results>1){
            req.id = 1;
        }
        else{
            req.id = results[0].intDistrictId+1;
        }
        return next();
    })
}
function putIcon(req,res,next){
    res.locals.PanelIcon='category'
    return next();
}

router.use(putIcon);
//data manipulation and routing
router.route('/school')
    .get((req,res)=>{
        res.locals.PanelTitle='School'
        db.query(`SELECT * FROM tblschool WHERE isActive=1`,(err,results,field)=>{
            return res.render('maintenance/views/m-school',{schools:results});
        });
    })
    .post(getSCHId,(req,res)=>{
        db.query(`INSERT INTO tblschool 
        VALUES(${req.id},${req.body.Grading},"${req.body.School}",1)`,(err,results,field)=>{
            if(err) throw err;
            return res.redirect('/maintenance/school');
        });
    })
    .put((req,res)=>{
        db.query(`UPDATE tblschool SET
        strSchoolName = "${req.body.School}",
        intSGradingId = "${req.body.Grading}"
        WHERE intSchoolId = ${req.body.SId}`,(err,results,field)=>{
            if(err) throw err;
            return res.redirect('/maintenance/school');
        })
    })
router.route('/requirement')
    .get((req,res)=>{
        res.locals.PanelTitle='Requirements';
        db.query(`SELECT * FROM tblrequirements`,(err,results,field)=>{
            if(err) throw err;
            return res.render('maintenance/views/m-requirement', {requirements:results});
        });
    })
    .post(getRId,(req,res)=>{
        db.query(`INSERT INTO tblrequirements 
        VALUES(${req.id},'${req.body.requirement}',1)`,(err,results,field)=>{
            if(err) throw err;
            return res.redirect('/maintenance/requirement');
        });
    })
    .put((req,res)=>{
        db.query(`UPDATE tblrequirements SET
        strRequirementDesc = '${req.body.requirement}'
        WHERE intRequirementId = ${req.body.RId}`,(err,results,field)=>{
            if(err) throw err;
            return res.redirect('/maintenance/requirement');
        });
    })
router.route('/grade')
    .get((req,res)=>{
        res.locals.PanelTitle='Grading Types'
        res.render('maintenance/views/m-grade');
    })

router.route('/scholarship')
    .get((req,res)=>{
        res.locals.PanelTitle='Scholarship Type'
        db.query(`SELECT * FROM tblscholarshiptype WHERE isActive=1`,(err,results,field)=>{
            if(err) throw err;
            return res.render('maintenance/views/m-scholarship',{stypes:results});
        })
    })
    .post(getSTId,(req,res)=>{
        db.query(`INSERT INTO tblscholarshiptype
        VALUES(${req.id},"${req.body.STname}",${req.body.Alloc},1)`,(err,results,field)=>{
            if(err) throw err;
            return res.redirect('/maintenance/scholarship');
        })
    })
    .put((req,res)=>{
        db.query(`UPDATE tblscholarshiptype SET
        strSTDesc = "${req.body.STname}",
        dblSTAllocation = ${req.body.Alloc}
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
    .get(func.getDistrict,(req,res)=>{
        res.locals.PanelTitle='Barangay'
        db.query(`call brgy_district()`,(err,results,field)=>{
            if(err) throw err;
            return res.render('maintenance/views/m-barangay',{barangays:results[0],districts:req.district});
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
        intBDistrictId = "${req.body.district}"
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
        res.locals.PanelTitle='Courses'
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
        res.locals.PanelTitle='Batch'
        db.query(`SELECT * FROM tblbatch WHERE isActive=1`,(err,results,field)=>{
            if(err) throw err;
            console.log(results);   
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
router.route('/district')
    .get((req,res)=>{
        res.locals.PanelTitle="District";
        db.query(`SELECT * FROM tbldistrict WHERE isActive=1`,(err,results,field)=>{
            if(err) throw err;
            return res.render('maintenance/views/m-district',{districts:results});
        });
    })
    .post(getDId,(req,res)=>{
        db.query(`INSERT INTO tbldistrict 
        VALUES(${req.id},"${req.body.district}",1)`,(err,results,field)=>{
            if(err) throw err;
            res.redirect('/maintenance/district');
        });
    })
    .put((req,res)=>{
        db.query(`UPDATE tbldistrict SET
        strDistrictName = '${req.body.district}'
        WHERE intDistrictId = ${req.body.DId}`,(err,results,field)=>{
            if(err) throw err;
            res.redirect('/maintenance/district');
        });
    })

exports.maintenance = router;