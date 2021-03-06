var express = require('express');
var fs = require('fs');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var db = require('../../lib/database')();
var func = require('../auth/functions/transactions');
var moment = require('moment');
var dash = require('../auth/functions/dashboard');
var matchMiddleware = require('../auth/middlewares/matcher');
var smart = require('../auth/functions/smart');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, `${file.originalname}`)
    }
  })
var upload = multer({ storage:storage })

router.use(dash.adminDash,matchMiddleware.match);

router.route('/')
.get((req,res)=>{
    res.render('home/views/index');
})

router.route('/home')
    .get((req,res)=>{
        res.locals.PanelTitle='Dashboard';
        res.locals.applicant=req.applicant;
        res.locals.budget=req.budget;
        res.locals.slots=req.slots;
        res.locals.scholar=req.scholar;
        db.query(`SELECT * FROM tblsettings WHERE intSettingsId = 0`,(err,results,field)=>{
            if(results[0].datApplyDate == null)
            res.locals.Atime = 0;
            else
            res.locals.Atime = results[0].datApplyDate;
            console.log(results[0]);
            if(moment(results[0].datApplyDate).format('YYYY-MM-D') <= moment().format('YYYY-MM-D'))
                results[0].checkApply = 1;
            else
                results[0].checkApply = 0;
            if(moment(results[0].datRenewDate).format('YYYY-MM-D') <= moment().format('YYYY-MM-D'))
                results[0].checkRenew = 1;
            else
                results[0].checkRenew = 0;
            console.log(results[0].checkApply);
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
        WHERE enumStudentStat = 2 AND enumStatus = 1;
        UPDATE tblstudentreq tsr 
        JOIN tblscholarshipreq ts 
        ON tsr.intARRId = ts.intSRId 
        SET tsr.isSubmitted = 0
        WHERE enumReqtype = 2;`,(err,results,field)=>{
            if(err) throw err;
            return res.redirect('/home');
        })
    })


router.route('/apply')
    .get(func.barangay,func.school,func.course,(req,res)=>{
        db.query(`SELECT datApplyDate FROM tblsettings`,(err,results,field)=>{
            if(results[0].datApplyDate != null && moment(results[0].datApplyDate).format('YYYY-MM-D') >= moment().format('YYYY-MM-D'))
                return res.render('home/views/apply',{barangay:req.barangay, schools:req.schools, courses:req.course});
            else
                return res.render('home/views/noapply');
        })
    })
    .post(func.getSId,func.getEId,func.getPId,(req,res)=>{
        if(req.body.GA >= 1 && req.body.GA <=5 ){
            if(req.body.GA > 3)
            return res.json('grade');
            else{
                switch(req.body.GA){
                    case 1: req.body.GA = 98; break;
                    case 1.25: req.body.GA = 95; break;
                    case 1.5: req.body.GA = 92; break;
                    case 1.75: req.body.GA = 90; break;
                    case 2: req.body.GA = 87; break;
                    case 2.25: req.body.GA = 84; break;
                    case 2.5: req.body.GA = 81; break;
                    case 2.75: req.body.GA = 78; break;
                    case 3: req.body.GA = 75; break;

                }
            }
        }
        if(req.body.GA >= 6 && req.body.GA <=100 ){
            if(req.body.GA < 75)
            return res.json('grade');
        }
        db.query(`INSERT INTO tblstudentdetails 
        VALUES('${req.SId}','${req.body.barangay}',${req.body.school},${req.body.course},'${req.body.lastname}','${req.body.firstname}','${req.body.middlename}','${req.body.bday}','${req.body.bplace}'
        ,'${req.body.house}','${req.body.street}','${req.body.zipcode}','${req.body.gender}','${req.body.citizenship}','${req.body.mobnum}','${req.body.email}'
        ,'${req.body.taxincome}','${req.body.siblings}','applicant',CURDATE(),1,0);
        INSERT INTO tbleducbg 
        VALUES('${req.EId}','${req.SId}','${req.body.lastschool}','${req.body.sector}','${req.body.GA}');
        INSERT INTO tblparentsinfo 
        VALUES('${req.PId}','${req.SId}','${req.body.parentname}','${req.body.parentaddress}','${req.body.parentoccupation}'
        ,'${req.body.parentEA}');`,(err,results,field)=>{
            if(err){
                return res.json(err);
            } 
            return res.json('success');
        })
    })

function getMaxUser(req,res,next){
    db.query(`SELECT MAX(strUserId) as strUserId FROM tblusers WHERE strUserId like 'sms%'`,(err,results,field)=>{
        req.MUId = results[0].strUserId;
        return next();
    })
}
router.route('/sponsorapply')
    .get((req,res)=>{
        return res.render('home/views/sponsorapply');
    })
    .post(getMaxUser,func.getSTId,upload.single('CI'),(req,res)=>{
        var id = smart.counter('coordinator',req.id,req.MUId)
        var password = Math.random().toString(36).substr(2,8);
        db.query(`INSERT INTO tblscholarshiptype(intSTId,strSTDesc) VALUES(${req.id},'${req.body.program}');
        INSERT INTO tblusers(strUserId,intSchTypeId,strUserEmail,strUserPassword,enumUserType,isActive) VALUES('${id}','${req.id}','${req.body.coordinator}','${password}',3,0);`,(err,results,field)=>{
            if(err){
                return res.send(err);
            }
            return res.redirect('/');
        })
    })

exports.index = router;