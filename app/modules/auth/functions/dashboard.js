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
    WHERE enumStudentStat=2 AND intSRSTId=${req.session.user.intSchTypeId} AND enumStatus = 1;
    select * from tblbudget order by datBudgetDate desc limit 2;
    SELECT * FROM tblscholarshiptype WHERE intSTId = ${req.session.user.intSchTypeId}`,(err,results,field)=>{
        if(err) throw err;
        console.log(results);
        req.applicant = results[0][0].applicant
        if(results[1][0] != null){
            console.log('if');
            req.budget = results[1][0].dblAmount-(results[4][0].dblSTAllocation*results[2][0].scholar)
            req.budget = req.budget.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            req.slots = (results[1][0].intSlots-results[2][0].scholar)
            req.buds = results[1][0].dblAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        }
        else{
            console.log('else');
            req.budget = 0;
            req.slots = 0;
            req.buds = 0;
        }
        req.scholar = results[2][0].scholar
        req.alloc = results[4][0].dblSTAllocation.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');


        req.change = Math.round((((results[3][0].dblAmount - results[3][1].dblAmount)/results[3][1].dblAmount)*100))
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
            req.applicant = results[0][0].applicant
            if(results[1][0] != null){
                req.budget = results[1][0].dblAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                req.slots = (results[1][0].intSlots-results[2][0].scholar)
            }
            else{
                req.budget = 0;
                req.slots = 0;
            }
            req.scholar = results[2][0].scholar
            return next();
        })
}