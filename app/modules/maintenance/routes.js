var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var db = require('../../lib/database')();
var func = require('../auth/functions/transactions');
var smart = require('../auth/functions/smart');
var crypto = require('crypto');
var matchMiddleware = require('../auth/middlewares/matcher');

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
function getGId(req,res,next){
    db.query(`SELECT max(intGradingId) as intGradingId FROM tblgrading`,(err,results,field)=>{
        if(results>1){
            req.id = 1;
        }
        else{
            req.id = results[0].intGradingId+1;
        }
        return next();
    })
}


router.use(matchMiddleware.match);



//data manipulation and routing
router.route('/school')
    .get(func.grading,(req,res)=>{
        res.locals.PanelTitle='School'
        db.query(`SELECT ts.*,tg.strGradingDesc FROM tblschool ts join tblgrading tg on (intSGradingId = intGradingId)`,(err,results,field)=>{
            return res.render('maintenance/views/m-school',{schools:results,gradings:req.gradings});
        });
    })
    .post(getSCHId,(req,res)=>{
        db.query(`INSERT INTO tblschool 
        VALUES(?,?,?,1)`,[req.id,req.body.Grading,req.body.School],(err,results,field)=>{
            if(err){
                return res.json(err);
            } 
            return res.json('success');
        });
    })
    .put((req,res)=>{
        db.query(`UPDATE tblschool SET 
        strSchoolName= ?,
        intSGradingId= ? 
        WHERE intSchoolId= ?;`,[req.body.School,req.body.Grading,req.body.SId],(err,results,field)=>{
            if(err){
                return res.json(err);
            } 
            return res.json('success');
        });
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
        VALUES(?,?,1)`,[req.id,req.body.requirement],(err,results,field)=>{
            if(err){
                return res.json(err);
            } 
            return res.json('success');
        });
    })
    .put((req,res)=>{
        db.query(`UPDATE tblrequirements SET
        strRequirementDesc = ?
        WHERE intRequirementId = ?`,[req.body.requirement,req.body.RId],(err,results,field)=>{
            if(err){
                return res.json(err);
            } 
            return res.json('success');
        });
    })


router.route('/grade')
    .get((req,res)=>{
        res.locals.PanelTitle='Grading Types'
        db.query(`SELECT * FROM tblgrading`,(err,results,field)=>{
            return res.render('maintenance/views/m-grade',{gradings:results});
        })
    })
    .post(getGId,(req,res)=>{
        var queryString=`INSERT INTO tblgrading VALUES(${req.id},'${req.body.desc}',1);`;
        var i=0;
        req.body.grades.forEach(function(){
            queryString += `INSERT INTO tblgradingdetails(intGradingId, strGrade, enumGradeStatus) VALUES(${req.id},'${req.body.grades[i]}','${req.body.status[i]}');`;
            i++;   
        });
        console.log(queryString); 
        db.query(queryString,(err,results,field)=>{
            if(err){
                return res.json(err);
            } 
            return res.json('success');       
        })
    })
    .put((req,res)=>{
        db.query(`UPDATE tblgrading SET
        strGradingDesc = ?
        WHERE intGradingId = ?`,[req.body.Gdesc,req.body.GId],(err,results,field)=>{
            if(err){
                return res.json(err);
            }
            return res.json('success'); 
        })
    })
router.post('/query/grade',(req,res)=>{
    db.query(`SELECT * FROM tblgradingdetails WHERE intGradingId = ${req.body.gradeId}`,(err,results,field)=>{
        return res.json(results);
    });
})

router.route('/scholarship')
    .get(func.getFiles,(req,res)=>{
        res.locals.PanelTitle='Scholarship Type'
        db.query(`SELECT * FROM tblscholarshiptype`,(err,results,field)=>{
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
        strSTDesc = ?,
        dblSTAllocation = ?
        WHERE intSTId = ?`,[req.body.STname,req.body.Alloc,req.body.STId],(err,results,field)=>{
            if(err){
                return res.json(err);
            } 
            return res.json('success');
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
        VALUES(?,?,?,1)`,[req.id,req.body.district,req.body.Bname],(err,results,field)=>{
            if(err){

                return res.json(err);
            } 
            return res.json('success');
        })
    })
    .put((req,res)=>{
        db.query(`UPDATE tblbarangay SET
        strBarangayName = ?,
        intBDistrictId = ?
        WHERE intBarangayId = ?`,[req.body.Bname,req.body.district,req.body.BId],(err,results,field)=>{
            if(err){
                return res.json(err);
            }
            return res.json('success');
        })
    })


router.post('/query/delete',(req,res)=>{
    queryString =`DELETE FROM ${req.body.table} WHERE ${req.body.column} = ${req.body.Id}`;
    db.query(queryString,(err,results,field)=>{
        if(err){
            return res.json(err);
        } 
        return res.json('success');
    })
})


router.route('/course')
    .get((req,res)=>{
        res.locals.PanelTitle='Courses'
        db.query(`SELECT * FROM tblcourse`,(err,results,field)=>{
            if(err) throw err;
            return res.render('maintenance/views/m-course',{courses:results});
        })
    })
    .post(getCId,(req,res)=>{
        db.query(`INSERT INTO tblcourse
        VALUES(?,?,1)`,[req.id,req.body.Cname],(err,results,field)=>{
            if(err){
                return res.json(err);
            }
            return res.json('success');
        })
    })
    .put((req,res)=>{
        db.query(`UPDATE tblcourse SET
        strCourseName = ?
        WHERE intCourseId = ?`,[req.body.Cname,req.body.CId],(err,results,field)=>{
            if(err){
                return res.json(err);
            }
            return res.json('success');
        })
    })
    
router.route('/district')
    .get((req,res)=>{
        res.locals.PanelTitle="District";
        db.query(`SELECT * FROM tbldistrict`,(err,results,field)=>{
            if(err) throw err;
            return res.render('maintenance/views/m-district',{districts:results});
        });
    })
    .post(getDId,(req,res)=>{
        db.query(`INSERT INTO tbldistrict 
        VALUES(?,?,1)`,[req.id,req.body.district],(err,results,field)=>{
            if(err) {
                return res.json(err);
            }
            return res.json('success');
        });
    })
    .put((req,res)=>{
        db.query(`UPDATE tbldistrict SET
        strDistrictName = ?
        WHERE intDistrictId = ?`,[req.body.district,req.body.BId],(err,results,field)=>{
            if(err) {
                return res.json(err);
            }
            return res.json('success');
        });
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
        VALUES(?,?,?,?,?)`,[req.SCId,req.body.School,req.body.Course,req.body.Year,req.body.Term],(err,results,field)=>{
            if(err){
                return res.json(err);
            } 
            return res.json('success');
        })
    })
    .put((req,res)=>{
        db.query(`UPDATE tblschcour SET
        intSCSchoolId =?,
        intSCCourseId =?,
        strYears = ?,
        enumTerm = ?
        WHERE intSCId = ?`,[req.body.School,req.body.Course,req.body.Year,req.body.Term,req.body.Id],(err,results,field)=>{
            if(err){
                return res.json(err);
            } 
            return res.json('success');
        })
    })
router.post('/query/active',(req,res)=>{
    queryString =`UPDATE ${req.body.table} SET isActive = ${req.body.state} WHERE ${req.body.column} = ${req.body.Id}`;
    db.query(queryString,(err,results,field)=>{
        if(err){
            return res.json(err)
        }
        return res.json('success')
    })
})



exports.maintenance = router;