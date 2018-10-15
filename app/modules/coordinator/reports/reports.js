var db = require('../../../lib/database')();
var moment = require('moment'); 
var pug = require('pug');
var pdf = require('html-pdf');

exports.budgetRep = (req,res,next)=>{
    db.query(`SELECT dblAmount,intSlots,datBudgetDate 
            FROM tblbudget 
            WHERE intBSTId = ${req.session.user.intSchTypeId} AND year(datBudgetDate) = ${req.body.date};
            select count(distinct intCStudId) as scholar 
            from tblclaim join tblusers on(intCStudId = intUStudId) 
            where year(datDateRenew) = ${req.body.date} AND intSchTypeId = ${req.session.user.intSchTypeId};
            SELECT * FROM tblscholarshiptype WHERE intSTId = ${req.session.user.intSchTypeId}`,(err,results,field)=>{
                if(err) throw err;
                console.log(results);
                var data = [];
                if(results[0][0] != null){
                    console.log('if');
                    req.remaining = results[0][0].dblAmount-(results[2][0].dblSTAllocation*results[1][0].scholar)
                    req.actual = results[2][0].dblSTAllocation*results[1][0].scholar;
                    req.budget = results[0][0].dblAmount
                    req.date = moment(results[0][0].datBudgetDate).format('YYYY');
                }
                req.scholar = results[1][0].scholar
                req.alloc = results[2][0].dblSTAllocation
                var html = pug.renderFile('./app/modules/coordinator/reports/budgetReport.pug',{data:{budget:req.budget,actual:req.actual,remaining:req.remaining,year:req.date,scholars:req.scholar,alloc:req.alloc,sponsor:results[2][0],coordinator:req.session.user.strUserEmail}});
                console.log(html);
                pdf.create(html,{
                    format:"Letter",
                    border: { top: '0.6in', right: '0.6in', bottom: '0.6in', left: '0.6in' }})
                    .toFile('reports/budgetReport-'+req.body.date+'.pdf',function(err,res){
                    if(err) console.log(err);
                    console.log(res.filename);
                    
                })
            })
}
exports.budgetCurve = (req,res,next)=>{
    db.query(`SELECT * FROM tblbudget WHERE intBSTId = ${req.session.user.intSchTypeId} AND year(datBudgetDate) >= ${req.body.range[0]} AND year(datBudgetDate) <= ${req.body.range[1]};
    SELECT * FROM tblscholarshiptype WHERE intSTId = ${req.session.user.intSchTypeId}`,(err,results,field)=>{
        console.log(results);
        var budgets=[],budgetLabels=[]
        results[0].forEach(budget=>{
            budgets.push(budget.dblAmount);
            budgetLabels.push(moment(budget.datBudgetDate).format('YYYY'));
        })
        for(var i=0;i<results[0].length;i++){
            results[0][i].datBudgetDate = moment(results[0][i].datBudgetDate).format('YYYY');
        }
        req.range = req.body.range[0]+" - "+req.body.range[1];
        var html = pug.renderFile('./app/modules/coordinator/reports/budgetCurve.pug',{data:{budgets:budgets,budgetLabels:budgetLabels,tableData:results[0],sponsor:results[1][0],range:req.range,coordinator:req.session.user.strUserEmail}})
        console.log(html)
        pdf.create(html,{
            format:"Letter",
            border: { top: '0.6in', right: '0.6in', bottom: '0.6in', left: '0.6in' }})
            .toFile('reports/budgetCurve '+req.range+'.pdf',function(err,res){
            if(err) console.log(err);
            console.log(res.filename);
        })
    })
}
exports.StudDet = (req,res,next)=>{
    db.query(`SELECT distinct(intCStudId),datDateRenew,tblstudentdetails.* FROM tblclaim join (tblstudentdetails,tblusers) on (intCStudId = intStudentId AND intStudentId = intUStudId) WHERE year(datDateRenew) = ${req.body.date} AND enumBudget = ${req.body.cycle} AND intSchTypeId = ${req.session.user.intSchTypeId};
    SELECT * FROM tblscholarshiptype WHERE intSTId = ${req.session.user.intSchTypeId};`,(err,results,field)=>{
        if(err) throw err;
        for(var i=0;i<results[0].length;i++){
            results[0][i].datDateRenew = moment(results[0][i].datDateRenew).format('YYYY');
        }
        var html = pug.renderFile('./app/modules/coordinator/reports/studentDetails.pug',{data:{students:results[0],sponsor:results[1][0],cycle:req.body.cycle,year:req.body.date,coordinator:req.session.user.strUserEmail}})
        console.log(html)
        pdf.create(html,{
            format:"Letter",
            border: { top: '0.6in', right: '0.6in', bottom: '0.6in', left: '0.6in' }})
            .toFile('reports/Student Details '+req.body.date+'C'+req.body.cycle+'.pdf',function(err,res){
            if(err) throw err;
            console.log(res.filename);
        })
    })
}