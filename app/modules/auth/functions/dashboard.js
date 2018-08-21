var db = require('../../../lib/database')();


exports.dashboard = (req,res,next) =>{
    db.query(`SELECT count(distinct intStudentId) as applicant 
    from tblstudentdetails join (tblstudentreq,tblscholarshipreq) 
    on (intStudentId = intARStudId AND intARRId = intSRId) 
    WHERE enumStudentStat=1 AND intSRSTId=${req.session.user.intSchTypeId};
    SELECT dblAmount,intSlots 
    FROM dbsms2.tblbudget 
    WHERE intBSTId = ${req.session.user.intSchTypeId} AND datBudgetDate like(SELECT max(datBudgetDate) from tblbudget);
    SELECT count(distinct intStudentId) as scholar 
    from tblstudentdetails join (tblstudentreq,tblscholarshipreq) 
    on (intStudentId = intARStudId AND intARRId = intSRId) 
    WHERE enumStudentStat=2 AND intSRSTId=${req.session.user.intSchTypeId};`,(err,results)=>{
        if(err) throw err;
        console.log(results);
        return next();
    })
}

exports.applicant = (req,res,next) =>{
    db.query(`SELECT count(distinct intStudentId) as applicant 
    from tblstudentdetails join (tblstudentreq,tblscholarshipreq) 
    on (intStudentId = intARStudId AND intARRId = intSRId) 
    WHERE enumStudentStat=1 AND intSRSTId=${req.session.user.intSchTypeId};`,(err,results,field)=>{
        req.applicant = results[0].applicant;
        return next();
    });
}
exports.slots = (req,res,next) =>{
    db.query(`SELECT dblAmount,intSlots 
    FROM dbsms2.tblbudget 
    WHERE intBSTId = ${req.session.user.intSchTypeId} AND datBudgetDate like(SELECT max(datBudgetDate) from tblbudget);`,(err,results,field)=>{
        req.budget = results[0].dblAmount;
        req.slot = results[0].intSlots;
    })
    db.query(`SELECT count(distinct intStudentId) as scholar 
    from tblstudentdetails join (tblstudentreq,tblscholarshipreq) 
    on (intStudentId = intARStudId AND intARRId = intSRId) 
    WHERE enumStudentStat=2 AND intSRSTId=${req.session.user.intSchTypeId};`,(err,results,field)=>{
        console.log(results);
        console.log("slots" + req.slot);
        req.slots = (req.slot-results[0].scholar);
    })
    return next();
}
exports.scholar = (req,res,next)=>{
    db.query(`SELECT count(distinct intStudentId) as scholar 
    from tblstudentdetails join (tblstudentreq,tblscholarshipreq) 
    on (intStudentId = intARStudId AND intARRId = intSRId) 
    WHERE enumStudentStat=2 AND intSRSTId=${req.session.user.intSchTypeId};`,(err,results,field)=>{
        console.log(results);
        req.scholar = results[0].scholar;
        return next();
    })
}