var db = require('../../../lib/database')();


exports.dashboard = (req,res,next) =>{
    db.query(`SELECT count(distinct intStudentId) as applicant 
    from tblstudentdetails join (tblstudentreq,tblscholarshipreq) 
    on (intStudentId = intARStudId AND intARRId = intSRId) 
    WHERE enumStudentStat=1 AND intSRSTId=${req.session.user.intSchTypeId};
    SELECT dblAmount,intSlots 
    FROM tblbudget 
    WHERE intBSTId = ${req.session.user.intSchTypeId} AND enumBudgetStatus = 2;
    SELECT count(distinct intStudentId) as scholar 
    from tblstudentdetails join (tblstudentreq,tblscholarshipreq) 
    on (intStudentId = intARStudId AND intARRId = intSRId) 
    WHERE enumStudentStat=2 AND intSRSTId=${req.session.user.intSchTypeId};`,(err,results,field)=>{
        if(err) throw err;
        console.log(results);
        req.applicant = results[0][0].applicant.toFixed().replace(/\d(?=(\d{3})+\.)/g, '$&,');
        if(results[1][0] != null){
            console.log('if');
            req.budget = results[1][0].dblAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            req.slots = (results[1][0].intSlots-results[2][0].scholar).toFixed().replace(/\d(?=(\d{3})+\.)/g, '$&,');
        }
        else{
            console.log('else');
            req.budget = 0;
            req.slots = 0;
        }
        req.scholar = results[2][0].scholar.toFixed().replace(/\d(?=(\d{3})+\.)/g, '$&,');
        return next();
    })
}
exports.adminDash = (req,res,next) =>{
    db.query(`SELECT count(distinct intStudentId) as applicant 
        from tblstudentdetails
        WHERE enumStudentStat = 1;
        SELECT sum(dblAmount) as dblAmount,sum(intSlots) as intSlots 
        FROM tblbudget WHERE enumBudgetStatus = 2;
        SELECT count(distinct intStudentId) as scholar 
        from tblstudentdetails
        WHERE enumStudentStat = 2;`,(err,results,field)=>{
            console.log(results);
            req.applicant = results[0][0].applicant.toFixed().replace(/\d(?=(\d{3})+\.)/g, '$&,');
            req.budget = results[1][0].dblAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            req.slots = (results[1][0].intSlots-results[2][0].scholar).toFixed().replace(/\d(?=(\d{3})+\.)/g, '$&,');
            req.scholar = results[2][0].scholar.toFixed().replace(/\d(?=(\d{3})+\.)/g, '$&,');
            return next();
        })
}