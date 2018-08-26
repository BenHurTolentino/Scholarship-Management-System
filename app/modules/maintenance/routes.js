var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var db = require('../../lib/database')();
var func = require('../auth/functions/transactions');
var smart = require('../auth/functions/smart');
var crypto = require('crypto');

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
            if(err){
                return res.json(err);
            } 
            return res.json('success');
        });
    })
    .put((req,res)=>{
        db.query(`UPDATE tblschool SET 
        strSchoolName='${req.body.School}',
        intSGradingId=${req.body.Grading} 
        WHERE intSchoolId='${req.body.SId}';`,(err,results,field)=>{
            if(err){
                return res.json(err);
            } 
            return res.json('success');
        });
    })
router.get('/school/:intSchoolId',(req,res)=>{
    db.query(`DELETE FROM tblschool WHERE intSchoolId='${req.params.intSchoolId}';`,(err,results,field)=>{
        if(err)throw err
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
            if(err){
                return res.json(err);
            } 
            return res.json('success');
        });
    })
    .put((req,res)=>{
        db.query(`UPDATE tblrequirements SET
        strRequirementDesc = '${req.body.requirement}'
        WHERE intRequirementId = ${req.body.RId}`,(err,results,field)=>{
            if(err){
                return res.json(err);
            } 
            return res.json('success');
        });
    })
router.get('/requirement/:intRequirementId',(req,res)=>{
    db.query(`DELETE FROM tblrequirements WHERE intRequirementId = '${req.params.intRequirementId}'`,(err,results,field)=>{
        if(err) throw err;
        return res.redirect('/maintenance/requirement');
    })
})
router.route('/grade')
    .get((req,res)=>{
        res.locals.PanelTitle='Grading Types'
        res.render('maintenance/views/m-grade');
    })



router.route('/scholarship')
    .get(func.getFiles,(req,res)=>{
        res.locals.PanelTitle='Scholarship Type'
        db.query(`SELECT * FROM tblscholarshiptype WHERE isActive=1`,(err,results,field)=>{
            if(err) throw err;
            return res.render('maintenance/views/m-scholarship',{stypes:results,files:req.files});
        })
    })
    .post(getSTId,func.getCoorId,(req,res)=>{
        if(req.user!=''){
            var id = smart.counter('coordinator',req.id,req.user[0].strUserId)
        }
        else{
            var id = smart.counter('coordinator',req.id,'')
        }
        var password = Math.random().toString(36).substr(2,8);
        var token = crypto.randomBytes(32).toString('hex');
        db.query(`INSERT INTO tblscholarshiptype
        VALUES(${req.id},"${req.body.STname}",${req.body.Alloc},1);
        INSERT INTO tblusers(strUserId,intSchTypeId,strUserEmail,strUserPassword,enumUserType,isActive,token)
        VALUES('${id}',${req.id},'${req.body.STemail}','${password}',3,1,'${token}')`,(err,results,field)=>{
            if(err){
                return res.json(err);
            } 
            return res.json('success');
        })
    })
    .put((req,res)=>{
        db.query(`UPDATE tblscholarshiptype SET
        strSTDesc = "${req.body.STname}",
        dblSTAllocation = ${req.body.Alloc}
        WHERE intSTId = ${req.body.STId}`,(err,results,field)=>{
            if(err){
                return res.json(err);
            } 
            return res.json('success');
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
router.route('/scholarship/:intSTId/requirement')
    .get(func.requirements,(req,res)=>{
        res.locals.PanelTitle='Scholarship Requirements';
        db.query(`call scholarship_requirements(${req.params.intSTId})`,(err,results,field)=>{
            if(err) throw err;
            console.log(results);
            res.locals.scholarship = req.params.intSTId;
            return res.render('maintenance/views/m-sreq',{reqs:results[0],files:req.requirements});
        })
    })
    .post(func.getSRId,(req,res)=>{
        db.query(`INSERT INTO tblscholarshipreq 
        VALUES(${req.SRId},${req.body.Requirement},${req.params.intSTId},${req.body.rtype},1)`,(err,results,field)=>{
            if(err){
                return res.json(err);
            } 
            return res.json(`success`);
        })
    })
router.get('/scholarship/:intSTId/requirement/:intSRId',(req,res)=>{
    db.query(`DELETE FROM tblscholarshipreq WHERE intSRId = ${req.params.intSRId}`,(err,results,field)=>{
        if(err) throw err;
        return res.redirect(`/maintenance/scholarship/${req.params.intSTId}/requirement`);
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
            if(err){

                return res.json(err);
            } 
            return res.json('success');
        })
    })
    .put((req,res)=>{
        db.query(`UPDATE tblbarangay SET
        strBarangayName = "${req.body.Bname}",
        intBDistrictId = "${req.body.district}"
        WHERE intBarangayId = ${req.body.BId}`,(err,results,field)=>{
            if(err){
                return res.json(err);
            } 
            return res.json('success');
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
            if(err){
                return res.json(err);
            }
            return res.json('success');
        })
    })
    .put((req,res)=>{
        db.query(`UPDATE tblcourse SET
        strCourseName = "${req.body.Cname}"
        WHERE intCourseId = ${req.body.CId}`,(err,results,field)=>{
            if(err){
                return res.json(err);
            }
            return res.json('success');
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
            if(err){
                return res.json(err);
            } 
            return res.json('success');
        })
    })
    .put((req,res)=>{
        db.query(`UPDATE tblbatch SET
        strBatchDesc = "${req.body.Bname}"
        WHERE intBatchId = ${req.body.BId}`,(err,results,field)=>{
            if(err){
                return res.json(err);
            } 
            return res.json('success');
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
            if(err) {
                return res.json(err);
            }
            return res.json('success');
        });
    })
    .put((req,res)=>{
        db.query(`UPDATE tbldistrict SET
        strDistrictName = '${req.body.district}'
        WHERE intDistrictId = ${req.body.BId}`,(err,results,field)=>{
            if(err) {
                return res.json(err);
            }
            return res.json('success');
        });
    })
router.get('/district/:intDistrictId',(req,res)=>{
    db.query(`DELETE FROM tbldistrict WHERE intDistrictId = '${req.params.intDistrictId}'`,(err,results,field)=>{
        if(err) throw err;
        return res.redirect('/maintenance/district');
    })
})
router.route('/credit')
    .get(func.school,func.course,(req,res)=>{
        db.query(`call School_Courses()`,(err,results,field)=>{
            if(err) throw err;
            return res.render('maintenance/views/m-credit',{credits:results[0],schools:req.schools,courses:req.course});
        })
    })
    .post(func.getSCId,(req,res)=>{
        db.query(`INSERT INTO tblschcour 
        VALUES(${req.SCId},${req.body.School},${req.body.Course},${req.body.Year},${req.body.Term})`,(err,results,field)=>{
            if(err){
                return res.json(err);
            } 
            return res.json('success');
        })
    })
    .put((req,res)=>{
        db.query(`UPDATE tblschcour SET
        intSCSchoolId =${req.body.School},
        intSCCourseId =${req.body.Course},
        strYears = ${req.body.Year},
        enumTerm = '${req.body.Term}'
        WHERE intSCId = ${req.body.Id}`,(err,results,field)=>{
            if(err){
                return res.json(err);
            } 
            return res.json('success');
        })
    })
router.get('/credit/:intSCId',(req,res)=>{
    db.query(`DELETE FROM tblschcour WHERE intSCId=${req.params.intSCId}`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/maintenance/credit');
    })
})



exports.maintenance = router;