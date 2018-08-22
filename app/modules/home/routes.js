var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var db = require('../../lib/database')();
var func = require('../auth/functions/transactions');
var moment = require('moment');

router.route('/')
.get((req,res)=>{
    res.render('home/views/index');
})

router.route('/home')
    .get((req,res)=>{
        res.locals.PanelTitle='Dashboard';
        db.query(`SELECT * FROM tblsettings WHERE intSettingsId = 0`,(err,results,field)=>{
            console.log(results[0]);
            if(moment(results[0].datApplyDate).format('YYYY-MM-D') == moment().format('YYYY-MM-D'))
                results[0].checkApply = 1;
            else
                results[0].checkApply = 0;
            if(moment(results[0].datRenewDate).format('YYYY-MM-D') == moment().format('YYYY-MM-D'))
                results[0].checkRenew = 1;
            else
                results[0].checkRenew = 0;
            return res.render('home/views/home',{setting:results[0]});
        })
    })
    .post((req,res)=>{
        db.query(`UPDATE tblsettings SET
        datApplyDate = null,
        datRenewDate = '${req.body.endDate}'
        WHERE intSettingsId = 0;
        UPDATE tblstudentdetails SET
        isRenewal = 1
        WHERE enumStudentStat = 2 AND enumStatus = 1;
        UPDATE tblstudentreq tsr 
        JOIN tblscholarshipreq ts 
        ON tsr.intARRId = ts.intSRId 
        SET tsr.isSubmitted = 0
        WHERE enumReqtype = 2;`,(err,results,field)=>{
            if(err) throw err;
        })
        return res.redirect('/home');
    })
    .put((req,res)=>{
        db.query(`UPDATE tblsettings SET
        datApplyDate = '${req.body.endDate}',
        datRenewDate = null
        WHERE intSettingsId = 0;
        UPDATE tblstudentdetails SET
        isRenewal = 1
        WHERE enumStudentStat = 2 AND enumStatus = 1`,(err,results,field)=>{
            if(err) throw err;
            return res.redirect('/home');
        })
    })


router.route('/apply')
    .get(func.barangay,func.school,func.course,(req,res)=>{
        db.query(`SELECT datApplyDate FROM tblsettings`,(err,results,field)=>{
            if(results[0].datApplyDate != null && moment(results[0].datApplyDate).format('YYYY-MM-D') != moment().format('YYYY-MM-D'))
                return res.render('home/views/apply',{barangay:req.barangay, schools:req.schools, courses:req.course});
            else
                return res.render('home/views/noapply');
        })
    })
    .post(func.getSId,func.getEId,func.getPId,(req,res)=>{
        db.query(`INSERT INTO tblstudentdetails 
        VALUES('${req.SId}','${req.body.barangay}',${req.body.school},${req.body.course},'${req.body.lastname}','${req.body.firstname}','${req.body.middlename}','${req.body.bday}','${req.body.bplace}'
        ,'${req.body.house}','${req.body.street}','${req.body.zipcode}','${req.body.gender}','${req.body.citizenship}','${req.body.mobnum}','${req.body.email}'
        ,'${req.body.taxincome}','${req.body.siblings}','applicant',CURDATE(),1,0)`,(err,results,field)=>{
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