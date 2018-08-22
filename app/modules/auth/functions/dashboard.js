var db = require('../../../lib/database')();


exports.dashboard = (req,res,next) =>{
    db.query(`SELECT count(distinct intStudentId) as applicant 
    from tblstudentdetails join (tblstudentreq,tblscholarshipreq) 
    on (intStudentId = intARStudId AND intARRId = intSRId) 
    WHERE enumStudentStat=1 AND intSRSTId=${req.session.user.intSchTypeId};
    SELECT dblAmount,intSlots 
    FROM dbsms2.tblbudget 
    WHERE intBSTId = ${req.session.user.intSchTypeId} AND datBudgetDate like(SELECT max(datBudgetDate) from tblbudget WHERE isApprove = 1);
    SELECT count(distinct intStudentId) as scholar 
    from tblstudentdetails join (tblstudentreq,tblscholarshipreq) 
    on (intStudentId = intARStudId AND intARRId = intSRId) 
    WHERE enumStudentStat=2 AND intSRSTId=${req.session.user.intSchTypeId};`,(err,results)=>{
        if(err) throw err;

        req.applicant = results[0][0].applicant;
        req.budget = results[1][0].dblAmount;
        req.slots = (results[1][0].intSlots-results[2][0].scholar);
        req.scholar = results[2][0].scholar;
        return next();
    })
}