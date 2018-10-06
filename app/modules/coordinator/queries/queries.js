var db = require('../../../lib/database')();

exports.queryData = (req,res,next)=>{
    db.query(`SELECT * FROM tblstudentdetails join tblusers on intStudentId = intUStudId WHERE enumStatus = 1 AND intSchTypeId = ${req.session.user.intSchTypeId};
    SELECT * FROM tblstudentdetails join tblusers on intStudentId = intUStudId WHERE enumStatus = 2 AND intSchTypeId = ${req.session.user.intSchTypeId};
    SELECT * FROM tblstudentdetails join tblusers on intStudentId = intUStudId WHERE enumStatus = 3 AND intSchTypeId = ${req.session.user.intSchTypeId};
    SELECT count(*) as scholars,strSchoolName from tblstudentdetails join (tblschool,tblusers) on (intStdSchoolId = intSchoolId AND intStudentId = intUStudId) WHERE intSchTypeId = ${req.session.user.intSchTypeId} group by intSchoolId;`,(err,results,field)=>{
        console.log(results);
        req.studC = results[0];
        req.studF = results[1];
        req.studG = results[2];
        req.schNum = results[3];
        return next();        
    })
}