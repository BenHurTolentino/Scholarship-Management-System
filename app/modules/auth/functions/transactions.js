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