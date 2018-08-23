var db = require('../../../lib/database')();

exports.noslots = (req,res,next) =>{
    db.query(`SELECT dblAmount,intSlots 
    FROM dbsms2.tblbudget 
    WHERE intBSTId = ${req.session.user.intSchTypeId} AND datBudgetDate like(SELECT max(datBudgetDate) from tblbudget WHERE enumBudgetStatus = 2);
    SELECT count(distinct intStudentId) as scholar 
    from tblstudentdetails join (tblstudentreq,tblscholarshipreq) 
    on (intStudentId = intARStudId AND intARRId = intSRId) 
    WHERE enumStudentStat=2 AND intSRSTId=${req.session.user.intSchTypeId};`,(err,results,field)=>{
        console.log(results);
        if(results[0][0] != null){
            req.slotnum = (results[0][0].intSlots-results[1][0].scholar);
        }
        else
            req.slotnum = 0;
        res.locals.slotnum = req.slotnum;
        return next();

    })
}
exports.coordinate = (req,res,next) =>{
    db.query(`SELECT strSTDesc FROM tblscholarshiptype WHERE intSTId = ${req.session.user.intSchTypeId}`,(err,results,field)=>{
        if(err) throw err;
        res.locals.scholarship = results[0].strSTDesc;
        return next();
    })
}