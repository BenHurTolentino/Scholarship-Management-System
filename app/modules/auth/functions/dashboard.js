var db = require('../../../lib/database')();

exports.applicant = (req,res,next) =>{
    db.query(`SELECT count(distinct intStudentId) as applicant 
    from tblstudentdetails join (tblapplicantreq,tblscholarshipreq) 
    on (intStudentId = intARStudId AND intARRId = intSRId) 
    WHERE enumStudentStat=1 AND intSRSTId=${req.session.user.intSchTypeId}`,(err,results,field)=>{
        res.locals.applicant = results[0].applicant;
        return next();
    });
}
exports.slots = (req,res,next) =>{
    db.query(`SELECT * 
    FROM dbsms2.tblbudget 
    WHERE intBSTId = 1 AND datBudgetDate like '2018%'`,(err,results,field)=>{
        res.locals.budget = results[0].dblAmount;
        req.slot = results[0].intSlots;
    })
    db.query(`SELECT count(distinct intStudentId) as scholar 
    from tblstudentdetails join (tblapplicantreq,tblscholarshipreq) 
    on (intStudentId = intARStudId AND intARRId = intSRId) 
    WHERE enumStudentStat=2 AND intSRSTId=${req.session.user.intSchTypeId}`,(err,results,field)=>{
        console.log(results);
        console.log("slots" + req.slot);
        res.locals.slots = (req.slot-results[0].scholar);
    })
    return next();
}
exports.scholar = (req,res,next)=>{
    db.query(`SELECT count(distinct intStudentId) as scholar 
    from tblstudentdetails join (tblapplicantreq,tblscholarshipreq) 
    on (intStudentId = intARStudId AND intARRId = intSRId) 
    WHERE enumStudentStat=2 AND intSRSTId=${req.session.user.intSchTypeId}`,(err,results,field)=>{
        console.log(results);
        res.locals.scholar = results[0].scholar;
        return next();
    })
}