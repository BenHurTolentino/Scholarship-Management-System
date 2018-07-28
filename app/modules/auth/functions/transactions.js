var db = require('../../../lib/database')();

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