var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var db = require('../../lib/database')();
var func = require('../auth/functions/transactions');

router.route('/')
.get((req,res)=>{
    res.render('home/views/index');
})

router.route('/home')
.get((req,res)=>{
    res.locals.PanelTitle='Dashboard';
    res.render('home/views/home');
});


router.route('/apply')
    .get(func.barangay,func.school,func.course,func.getScholarship,(req,res)=>{
        db.query(`SELECT * FROM tblbudget WHERE isApprove = 1`,(err,results,field)=>{
            if(results.length!=0)
                return res.render('home/views/apply',{barangay:req.barangay, schools:req.schools, courses:req.course, scholarships:req.scholarship});
            else
                return res.render('home/views/noapply');
        })
    })
    .post(func.getSId,func.getEId,func.getPId,func.getRequirement,func.getARId,(req,res)=>{
        console.log(req.scholar);
        db.query(`INSERT INTO tblstudentdetails 
        VALUES('${req.SId}','${req.body.barangay}','${req.body.lastname}','${req.body.firstname}','${req.body.middlename}','${req.body.bday}','${req.body.bplace}'
        ,'${req.body.house}','${req.body.street}','${req.body.zipcode}','${req.body.gender}','${req.body.citizenship}','${req.body.mobnum}','${req.body.email}'
        ,'${req.body.taxincome}','${req.body.siblings}','${req.body.tod}','${req.body.tg}','applicant',CURDATE())`,(err,results,field)=>{
            if(err) throw err;
        })

        db.query(`INSERT INTO tbleducbg 
        VALUES('${req.EId}','${req.SId}','${req.body.lastschool}','${req.body.sector}','${req.body.GA}','${req.body.eng}'
        ,'${req.body.sci}','${req.body.mth}')`,(err,results,field)=>{
            if(err) throw err;
        })

        db.query(`INSERT INTO tblparentsinfo 
        VALUES('${req.PId}','${req.SId}','${req.body.parentname}','${req.body.parentaddress}','${req.body.parentoccupation}'
        ,'${req.body.parentEA}')`,(err,results,field)=>{
            if(err) throw err;
        })

        res.redirect('/');
    })

exports.index = router;