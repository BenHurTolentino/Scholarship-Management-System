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

exports.slots_excess = (req,res,next) => {
    db.query(`SELECT * FROM tblscholarshiptype WHERE intSTId=${req.body.stype}`,(err,results,field)=>{
        console.log(results);
        req.slots = parseInt(req.body.budget/results[0].dblSTAllocation);
        req.excess = (req.body.budget%results[0].dblSTAllocation);
        console.log(req.excess);
        console.log(req.slots)
        return next();
    });
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
exports.getARId = (req,res,next) =>{
    db.query(`SELECT max(intARId) as intARId FROM tblapplicantreq`,(err,results,field)=>{
        if(results>1){
            req.ARId = 1;
        }
        else{
            req.ARId = results[0].intARId+1;
        }
        return next();
    })
}
exports.getScholarship = (req,res,next) =>{
    db.query(`SELECT * FROM tblscholarshiptype WHERE isActive=1`,(err,results,field)=>{
        req.scholarship = results;
        return next();
    });
}
exports.getscholarship_budget = (req,res,next) =>{
    console.log(moment().format('YYYY-M-D'));
    db.query(`call scholarship_budget('${moment().format('YYYY-M-D')}')`,(err,results,field)=>{
        req.scholarship = results[0];
        console.log(results[0]);
        
        return next();
    })
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
        console.log(results[0]);
        console.log('ID GRABBED');
        req.user = results[0];
        console.log(req.user);
        return next();
    })
}