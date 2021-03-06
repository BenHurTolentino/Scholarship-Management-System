var db = require('../../../lib/database')();
var moment = require('moment');

exports.requirements = (req,res,next) =>{
    db.query(`SELECT * FROM tblrequirements WHERE isActive=1`,(err,results,field)=>{
        req.requirements = results;
        return next();
    });
}

exports.applyreq = (req,res,next)=>{
    db.query(`CALL applicant_requirements(1)`,(err,results,field)=>{
        req.applyreq = results[0];
        return next();
    })
}
exports.getRequirement = (req,res,next)=>{
    db.query(`SELECT * FROM tblscholarshipreq WHERE intSRSTId = ${req.body.stype}`,(err,results,field)=>{
        req.scholar = results;
        return next();
    })
}
exports.getFiles = (req,res,next)=>{
    db.query(`SELECT * FROM tblrequirements`,(err,results,field)=>{
        req.files = results;
        return next();
    })
}

exports.slots_excess = (req,res,next) => {
    db.query(`SELECT * FROM tblscholarshiptype WHERE intSTId=${req.session.user.intSchTypeId}`,(err,results,field)=>{
        console.log(results);
        req.slots = parseInt(req.body.budget/results[0].dblSTAllocation);
        req.excess = (req.body.budget%results[0].dblSTAllocation);
        console.log(req.excess);
        console.log(req.slots)
        return next();
    });
}

exports.grading = (req,res,next) =>{
    db.query(`SELECT * FROM tblgrading WHERE isActive = 1`,(err,results,field)=>{
        req.gradings = results;
        return next();
    })
}

exports.getBGId = (req,res,next)=>{
    db.query(`SELECT MAX(intBudgetId) as intBudgetId FROM tblbudget`,(err,results,field)=>{
        if(err) throw err;
        if(results>1){
            req.BGId = 1;
        }
        else{
            req.BGId = results[0].intBudgetId+1;
        }
        return next();
    })
}
exports.getSRId = (req,res,next)=>{
    db.query(`SELECT MAX(intSRId) as intSRId FROM tblscholarshipreq`,(err,results,field)=>{
        if(err) throw err;
        if(results>1){
            req.SRId = 1;
        }
        else{
            req.SRId = results[0].intSRId+1;
        }
        return next();
    })
}

exports.barangay = (req,res,next) => {
    db.query(`SELECT * FROM tblbarangay WHERE isActive=1`,(err,results,field)=>{
        req.barangay = results;
        return next();
    })
}
exports.school = (req,res,next) =>{
    db.query(`SELECT * FROM tblschool WHERE isActive=1`,(err,results,field)=>{
        req.schools = results;
        return next();
    })
}
exports.course = (req,res,next) =>{
    db.query(`SELECT * FROM tblcourse WHERE isActive=1`,(err,results,field)=>{
        req.course = results;
        return next();
    })
}
exports.getSId = (req,res,next) =>{
    db.query(`SELECT max(intStudentId) as intStudentId FROM tblstudentdetails`,(err,results,field)=>{
        if(results>1){
            req.SId = 1;
        }
        else{
            req.SId = results[0].intStudentId+1;
        }
        return next();
    })
}
exports.getEId = (req,res,next) =>{
    db.query(`SELECT max(intEducBGId) as intEducBGId FROM tbleducbg`,(err,results,field)=>{
        if(results>1){
            req.EId = 1;
        }
        else{
            req.EId = results[0].intEducBGId+1;
        }
        return next();
    })
}
exports.getPId = (req,res,next) =>{
    db.query(`SELECT max(intParentId) as intParentId FROM tblparentsinfo `,(err,results,field)=>{
        if(results>1){
            req.PId = 1;
        }
        else{
            req.PId = results[0].intParentId+1;
        }
        return next();
    })
}
exports.getCId = (req,res,next) =>{
    db.query(`SELECT max(intClaimId) as intClaimId FROM tblclaim `,(err,results,field)=>{
        if(results>1){
            req.CId = 1;
        }
        else{
            req.CId = results[0].intClaimId+1;
        }
        return next();
    })
}
exports.getARId = (req,res,next) =>{
    db.query(`SELECT max(intARId) as intARId FROM tblstudentreq`,(err,results,field)=>{
        if(results>1){
            req.ARId = 1;
        }
        else{
            req.ARId = results[0].intARId+1;
        }
        return next();
    })
}
exports.getSCId = (req,res,next) =>{
    db.query(`SELECT max(intSCId) as intSCId FROM tblschcour`,(err,results,field)=>{
        if(results>1){
            req.SCId = 1;
        }
        else{
            req.SCId = results[0].intSCId+1;
        }
        return next();
    })
}
exports.getSTId = (req,res,next)=>{
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

exports.users = (req,res,next)=>{
    db.query(`SELECT * FROM tblusers WHERE strUserId != '${req.session.user.strUserId}'`,(err,results,field)=>{
        req.users = results;
        console.log(results);
        return next();
    })
}

exports.Ucourse = (req,res,next)=>{
    db.query(`SELECT intStdCourseId from tblstudentdetails WHERE intStudentId = ${req.session.user.intUStudId}`,(err,results)=>{
        req.Ucourse = results[0].intStdCourseId;
        return next();
    })
}

exports.getScholarship = (req,res,next) =>{
    db.query(`SELECT * FROM tblscholarshiptype WHERE isActive=1`,(err,results,field)=>{
        req.scholarship = results;
        return next();
    });
}
exports.getScholarship_apply = (req,res,next) =>{
    db.query(`SELECT * FROM tblscholarshiptype join tblbudget on(intBSTId = intSTId) WHERE enumBudgetStatus = 2 and isActive=1`,(err,results,field)=>{
        req.scholarship = results;
        return next();
    });
}
exports.getDistrict = (req,res,next)=>{
    db.query(`SELECT * FROM tbldistrict WHERE isActive=1`,(err,results,field)=>{
        req.district = results;
        return next();
    })
}
exports.getUserId = (req,res,next)=>{
    var today = new Date();
    var year = today.getFullYear();
    db.query(`call User_data('${year}')`,(err,results,field)=>{
        req.user = results[0];
        return next();
    })
}
exports.getCoorId = (req,res,next)=>{
    db.query(`call User_data('sms')`,(err,results,field)=>{
        req.user = results[0];
        return next();
    })
}
exports.getStudent = (req,res,next)=>{
    db.query(`SELECT * FROM tblstudentdetails WHERE intStudentId = ${req.params.intStudentId}`,(err,results,field)=>{
        req.info = results;
        return next();
    });
}
exports.settings = (req,res,next) =>{
    db.query(`SELECT * from tblsettings`,(err,results,field)=>{
        req.settings =results[0];
        return next();
    })
}