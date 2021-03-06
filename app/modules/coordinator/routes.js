var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var db = require('../../lib/database')();
var func = require('../auth/functions/transactions');
const smart = require('../auth/functions/smart');
const dash = require('../auth/functions/dashboard')
const checker = require('../auth/functions/checker')
var crypto = require('crypto');
var moment = require("moment");
var nodemailer = require('nodemailer');
var matchMiddleware = require('../auth/middlewares/matcher');

router.use(authMiddleware.hasAuth,dash.dashboard,checker.noslots,checker.coordinate,matchMiddleware.match);

router.route('/')
    .get((req,res)=>{
        res.locals.PanelTitle="Dashboard";
        res.locals.applicant=req.applicant;
        res.locals.budget=req.budget;
        res.locals.slots=req.slots;
        res.locals.scholar=req.scholar;
        res.locals.change=req.change;
        res.locals.alloc=req.alloc;
        res.locals.buds=req.buds
        res.render('coordinator/views/chome');
    });




  /////////////////////////////////////////////////
 //ajax request for updated claimed student list//
/////////////////////////////////////////////////
function update(req,res,next){
    if(req.body.stat==1){
        db.query(`UPDATE tblclaim SET
            datDateClaimed = CURDATE()
            WHERE intClaimId = ${req.body.ClaimId}`,(err,results,field)=>{
                if(err) throw err;
                console.log("posted:claim");
                return next();
            })
    }
    else{
        db.query(`UPDATE tblclaim SET
            datDateClaimed = null
            WHERE intClaimId = ${req.body.ClaimId}`,(err,results,field)=>{
                if(err) throw err;
                console.log("posted:claim");
                return next();
            })
    }
}
router.route('/claiming')
    .get((req,res)=>{
        var i=0;
        res.locals.PanelTitle="Claiming";
        db.query(`call student_claim(${req.session.user.intSchTypeId},'${moment().format('YYYY-MM-D')}')`,(err,results,field)=>{
            results[0].forEach(function(){
                if(results[0][i].datDateClaimed!=null){
                    results[0][i].datDateClaimed = moment(results[0][i].datDateClaimed).format('MMMM D,YYYY')
                }
                i++;
            })
            return res.render('coordinator/views/cclaiming',{claims:results[0]});
        })
    })
    .post(update,(req,res)=>{
        db.query(`call student_claim_one(${req.body.ClaimId})`,(err,results,field)=>{
            if(results[0][0].datDateClaimed!=null){
                results[0][0].datDateClaimed = moment(results[0][0].datDateClaimed).format('MMMM D,YYYY')
            }
            res.json(results[0][0]);
        })
    })

router.route('/renewal')
    .get((req,res)=>{
        res.locals.PanelTitle="Renewal";
        db.query(`call student_renew_scholarship(1)`,(err,results,field)=>{
            if(err) throw err;
            console.log(results[0]);
            return res.render('coordinator/views/crenewal',{students:results[0]});
        })
    })



router.route('/budget')
    .get(func.getScholarship,(req,res)=>{
        res.locals.PanelTitle = "Budget";
        var i=0;
        db.query(`call budget_info(${req.session.user.intSchTypeId})`,(err,results,field)=>{
            results[0].forEach(res=>{
                results[0][i].dblAmount=(results[0][i].dblAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                i++;
            })
            console.log(results[0]);
            return res.render('coordinator/views/cbudget',{programs:req.scholarship,budgets:results[0]});
        })
    })
    .post(func.getBGId,func.slots_excess,(req,res)=>{     
        db.query(`UPDATE tblbudget p1 SET p1.enumBudgetStatus = 3 
        WHERE p1.intBudgetId = (SELECT MAX(p2.intBudgetId) 
        FROM (SELECT * FROM tblbudget) p2 WHERE p2.intBSTId = ${req.session.user.intSchTypeId}); 
        INSERT INTO tblbudget 
        VALUES(?,?,?,?,?,CURDATE(),1)`,[req.BGId,req.session.user.intSchTypeId,req.body.budget,req.excess,req.slots],(err,results,field)=>{
            if(err) throw err;
            return res.redirect('/coordinator/budget');
        });
    })
router.get('/approve/:intBudgetId',(req,res)=>{
    db.query(`UPDATE tblbudget SET
    enumBudgetStatus = 2
    WHERE intBudgetId = ${req.params.intBudgetId}`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/coordinator/budget');
    })
})
  ///////////////////////////////
 //application Routing & Logic//
///////////////////////////////
router.get('/application',(req,res)=>{
    res.locals.PanelTitle='Application';
    db.query(`call student_apply_scholarship(1);`,(err,results,field)=>{
        return res.render('coordinator/views/ct-application',{applicants:results[0]});
    })
})
function CreateUser(req,res,next){
    if(req.slotnum!=0){
        if(req.user!=''){
            var id = smart.counter('student',req.session.user.intSchTypeId,req.user[0].strUserId);
        }
        else{
            var id = smart.counter('student',req.session.user.intSchTypeId,'');
        }
        var password = Math.random().toString(36).substr(2,8);
        var token = crypto.randomBytes(32).toString('hex');
        db.query(`INSERT INTO tblusers(strUserId,intUStudId,intSchTypeId,strUserEmail,strUserPassword,enumUserType,isActive,token) 
        VALUES('${id}',${req.params.intStudentId},${req.session.user.intSchTypeId},'${req.info[0].strStudentEmail}',"${password}",2,1,'${token}');
        SELECT * FROM tblstudentdetails WHERE intStudentId = ${req.params.intStudentId};
        SELECT strSTDesc FROM tblscholarshiptype WHERE intSTId = ${req.session.user.intSchTypeId};
        SELECT strUserId,token FROM tblusers WHERE intUStudId = ${req.params.intStudentId};`,(err,results,field)=>{
            if(err) throw err;
            console.log('USER ADDED');
            console.log(results);
            var link = req.protocol + '://' + req.get('host') + '/recovery/' + results[3][0].token;
            var content = `
            <p style="font-size: 16pt;">Dear Mr./Ms. <b>${results[1][0].strStudentLname}</b>,</p>
            <p style="font-size: 14pt;">Good day! Thank you for applying on our Scholarship program. We would like to inform you that you are now part of our ${results[2][0].strSTDesc} Scholarship Type Program. You will now receive ${results[2][0].dblSTAllocation} pesos per year only if you meet and follow the rules and regulations of or scholarship program.</p>
            <br>
            <p style="font-size: 14pt;">The following are your Account Information.</p>
            <p style="font-size: 14pt;">User ID: ${results[3][0].strUserId}</p>
            <p style="font-size: 14pt;">Click the link to Set-up your Account <a href='${link}'>${link}</a></p>
            <p style="font-size: 14pt;>Congratulations and we look forward to welcoming you to our Scholarship program.</p>
            <hr>
            <p style="color: rgba(0, 0, 0, 0.3);font-size: 16pt;"><i> *** THIS IS A SYSTEM GENERATED EMAIL.  PLEASE DO NOT REPLY TO THIS MESSAGE. *** </i></p>`
            var transporter = nodemailer.createTransport({
                service : 'gmail',
                auth : {
                    user:'ganilayow@gmail.com',
                    pass:'mastersensei'
                }
            });
            const mailOptions = {
                from: '"Scholarship Management System" <ganilayow@gmail.com>',
                to: results[1][0].strStudentEmail,
                subject: 'Scholarship Application',
                html: content
            }
            transporter.sendMail(mailOptions,function(err,info){
                if(err)
                    console.log(err);
                else
                    console.log(info);
            });
        })
    }
    return next();
}
router.get('/application/:intStudentId',func.getUserId,func.getStudent,CreateUser,func.getCId,(req,res)=>{
    if(req.slotnum!=0){
        db.query(`UPDATE tblstudentdetails SET
        enumStudentStat = 2
        WHERE intStudentID = '${req.params.intStudentId}';
        INSERT INTO tblclaim(intClaimId,intCStudId,enumBudget,datDateRenew) 
        VALUES(${req.CId},${req.params.intStudentId},1,${moment().format('YYYY-MM-DD')});`,(err,results,field)=>{
            if(err) throw err;  
        });
        return res.redirect('/coordinator/application');
    }
    else{
        return res.redirect('/coordinator/application');
    }
})
router.get('/application/:intStudentId/decline',(req,res)=>{
    db.query(`UPDATE tblstudentdetails SET
    enumStudentStat = 3
    WHERE intStudentID = '${req.params.intStudentId}'`,(err,results,field)=>{
        if(err) throw err;  
    });

    db.query(`SELECT * FROM tblstudentdetails WHERE intStudentId = ${req.params.intStudentId};
    SELECT strSTDesc FROM tblscholarshiptype WHERE intSTId = ${req.session.user.intSchTypeId};`,(err,results,field)=>{
        if(err) throw err;
        console.log(results);
        var content = `
        <p style="font-size: 16pt;">Dear Mr./Ms. <b>${results[0][0].strStudentLname}</b>,</p>
        <p style="font-size: 14pt;">Thank you for applying on our ${results[1][0].strSTDesc} scholarship program. We have considered your request but we are very sorry to inform you that your scholarship application was denied .</p>
        <hr>
        <p style="color: rgba(0, 0, 0, 0.3);font-size: 16pt;"><i> *** THIS IS A SYSTEM GENERATED EMAIL.  PLEASE DO NOT REPLY TO THIS MESSAGE. *** </i></p>`
        var transporter = nodemailer.createTransport({
            service : 'gmail',
            auth : {
                user:'ganilayow@gmail.com',
                pass:'mastersensei'
            }
        });
        const mailOptions = {
            from: '"Scholarship Management System" <ganilayow@gmail.com>',
            to: results[0][0].strStudentEmail,
            subject: 'Scholarship Application',
            html: content
        }
        transporter.sendMail(mailOptions,function(err,info){
            if(err)
                console.log(err);
            else
                console.log(info);
        });

    })
    res.redirect('/coordinator/application');
})


router.get('/renewal/:intStudentId',func.getCId,func.settings,(req,res)=>{
    db.query(`UPDATE tblstudentdetails SET
    isRenewal = 0
    WHERE intStudentID = '${req.params.intStudentId}'`,(err,results,field)=>{
        if(err) throw err;  
    });
    if(req.settings.datApplyDate==null){
        db.query(`INSERT INTO tblclaim(intClaimId,intCStudId,enumBudget,datDateRenew) 
        VALUES(${req.CId},${req.params.intStudentId},2,${moment().format('YYYY-MM-DD')})`,(err,results,field)=>{
            if(err) throw err;
        });
    }
    else{
        db.query(`INSERT INTO tblclaim(intClaimId,intCStudId,enumBudget,datDateRenew) 
        VALUES(${req.CId},${req.params.intStudentId},1,${moment().format('YYYY-MM-DD')})`,(err,results,field)=>{
            if(err) throw err;
        });
    }

    res.redirect('/coordinator/renewal');
})

  /////////////////
 //ajax requests//
/////////////////
router.post('/graphData',(req,res)=>{
    var Continuing=0,Forfeited=0,Graduated=0;
    var budgets=[],budgetLabels=[];
    var years=[],yearLabels=[];
    var data = [];
    console.log('hello GRaphs');
    db.query(`SELECT * FROM tblstudentdetails join tblusers on(intStudentId = intUStudId) WHERE enumStudentStat = 2 AND intSchTypeId = ${req.session.user.intSchTypeId};
    SELECT * FROM tblbudget WHERE intBSTId=${req.session.user.intSchTypeId};
    select year(datStudAppDate)as year,count(*) as students from tblstudentdetails join tblusers on(intStudentId = intUStudId) WHERE intSchTypeId = ${req.session.user.intSchTypeId} group by year(datStudAppDate)`,(err,results,field)=>{
        if(results[0].length != 0){
            results[0].forEach(student=>{
                switch(student.enumStatus){
                    case 'Continuing':Continuing++;break;
                    case 'Forfeited':Forfeited++;break;
                    case 'Graduated':Graduated++;break;
                }
            })
        }
        results[1].forEach(budget=>{
            budgets.push(budget.dblAmount);
            budgetLabels.push(moment(budget.datBudgetDate).format('MMM YYYY'));
        })
        results[2].forEach(year=>{
            years.push(year.students);
            yearLabels.push(year.year);
        })  


        data.push({doughnut:[Continuing,Forfeited,Graduated],
            doughnutLabels:['Continuing','Forfeited','Graduated'],
            doughnutTotal:Continuing+Forfeited+Graduated,
            budget:budgets,
            budgetLabels:budgetLabels,
            year:years,
            yearLabels:yearLabels});
        res.json(data[0]);

    })
})
router.post('/studinfo',(req,res)=>{
    db.query(`call student_info(${req.body.id})`,(err,results,field)=>{
        res.json(results[0][0]);
    })
})
router.post('/requirements',(req,res)=>{
    req.body.files.forEach(file => {
        db.query(`UPDATE tblstudentreq SET
        isSubmitted = 1 
        WHERE intARId = ?`,[file],(err,results,field)=>{
            if(err) throw err;    
        })
    });
    res.redirect('/coordinator/application');
})
router.post('/requirements/renew',(req,res)=>{
    req.body.files.forEach(file => {
        db.query(`UPDATE tblstudentreq SET
        isSubmitted = 1 
        WHERE intARId = ?`,[file],(err,results,field)=>{
            if(err) throw err;    
        })
    });
    res.redirect('/coordinator/renewal');
})
router.post('/query/apply',(req,res)=>{
    db.query(`call applicant_requirements(${req.body.StudentId})`,(err,results,field)=>{
        res.send(results[0])
    });
});
router.post('/query/renew',(req,res)=>{
    db.query(`call scholar_requirements(${req.body.StudentId})`,(err,results,field)=>{
        res.send(results[0])
    });
});

  ////////////////////////////
 //scholars Routing & logic//
////////////////////////////
router.route('/scholars')
    .get((req,res)=>{
        res.locals.PanelTitle = "Scholars";
        db.query(`call Scholar_scholarship('${req.session.user.intSchTypeId}')`,(err,results,field)=>{
            return res.render('coordinator/views/cscholars',{scholars:results[0]});
        })
    })
    .put((req,res)=>{
        console.log(req.body.stat);
        db.query(`UPDATE tblstudentdetails SET
        enumStatus = ?
        WHERE intStudentId = ?`,[req.body.stype,req.body.student],(err,results,field)=>{
            if(err) throw err
            return res.send('success');
        })
    })
    
  ////////////////////////
 //Sponsor Requirements// 
////////////////////////
router.route('/district')
    .get(func.getDistrict,(req,res)=>{
        res.locals.PanelTitle='District';
        db.query(`SELECT tsd.*, strDistrictName 
        FROM tblsponsordistrict tsd join tbldistrict on tsd.intSDistrictId = tbldistrict.intDistrictId 
        WHERE intSponsorId = ${req.session.user.intSchTypeId}`,(err,results,field)=>{
            return res.render('coordinator/views/cdistrict',{districts:results,choices:req.district});
        })
    })
    .post((req,res)=>{
        db.query(`INSERT into tblsponsordistrict(intSponsorId,intSDistrictId) 
        VALUES(${req.session.user.intSchTypeId},${req.body.district})`,(err,results,field)=>{
            if(err){
                return res.send(err);
            }
            return res.send('success');
        })
    })

router.route('/school')
    .get(func.school,(req,res)=>{
        res.locals.PanelTitle='School';
        db.query(`SELECT tss.*, strSchoolName
        FROM tblsponsorschool tss join tblschool on tss.intSSchoolId = tblschool.intSchoolId 
        WHERE intSponsorId = ${req.session.user.intSchTypeId}`,(err,results,field)=>{
            return res.render('coordinator/views/cschool',{schools:req.schools,data:results});
        })
    })
    .post((req,res)=>{
        db.query(`INSERT into tblsponsorschool(intSponsorId,intSSchoolId) 
        VALUES(${req.session.user.intSchTypeId},${req.body.school})`,(err,results,field)=>{
            if(err){
                return res.send(err);
            }
            return res.send('success');
        })
    })

router.route('/course')
    .get(func.course,(req,res)=>{
        res.locals.PanelTitle='Course';
        db.query(`SELECT tss.*, strCourseName
        FROM tblsponsorcourse tss join tblcourse on tss.intSCourseId = tblcourse.intCourseId 
        WHERE intSponsorId = ${req.session.user.intSchTypeId}`,(err,results,field)=>{
            return res.render('coordinator/views/ccourse',{courses:req.course,data:results});
        })
    })
    .post((req,res)=>{
        db.query(`INSERT into tblsponsorcourse(intSponsorId,intSCourseId) 
        VALUES(${req.session.user.intSchTypeId},${req.body.course})`,(err,results,field)=>{
            if(err){
                return res.send(err);
            }
            return res.send('success');
        })
    })
router.route('/documents')
    .get(func.requirements,(req,res)=>{
        res.locals.PanelTitle='Scholarship Requirements';
        db.query(`call scholarship_requirements(${req.session.user.intSchTypeId})`,(err,results,field)=>{
            if(err) throw err;
            console.log(results);
            res.locals.scholarship = req.params.intSTId;
            return res.render('coordinator/views/crequirement',{reqs:results[0],files:req.requirements});
        })
    })
    .post(func.getSRId,(req,res)=>{
        db.query(`INSERT INTO tblscholarshipreq 
        VALUES(?,?,?,?,1)`,[req.SRId,req.body.Requirement,req.session.user.intSchTypeId,req.body.rtype],(err,results,field)=>{
            if(err){
                return res.json(err);
            } 
            return res.json(`success`);
        })
    })

  ///////////
 //queries//
///////////
var command = require('./queries/queries');
router.route('/queries')
    .get(command.queryData,(req,res)=>{
        res.locals.PanelTitle='Queries';
        console.log(req.studC);
        return res.render('coordinator/views/cqueries',{studCs:req.studC,studFs:req.studF,studGs:req.studG,schNums:req.schNum});
    })
var reports = require('./reports/reports')
router.route('/reports')
    .get((req,res)=>{
        res.locals.PanelTitle='Reports';
        return res.render('coordinator/views/creports');
    })
    .post((req,res)=>{
        console.log(req.body)
        if(req.body.target == 1){
            reports.budgetRep(req,res);
        }
        else if(req.body.target == 2){
            reports.budgetCurve(req,res)
        }
        else if(req.body.target == 3){
            reports.StudDet(req,res)
        }
    })
router.get('/tryreport',(req,res)=>{
    db.query(`SELECT * FROM tblbudget WHERE intBSTId = ${req.session.user.intSchTypeId} AND year(datBudgetDate) >= 2015 AND year(datBudgetDate) <= 2018;
    SELECT * FROM tblscholarshiptype WHERE intSTId = ${req.session.user.intSchTypeId}`,(err,results,field)=>{
        console.log(results);
        var budgets=[],budgetLabels=[]
        results[0].forEach(budget=>{
            budgets.push(budget.dblAmount);
            budgetLabels.push(moment(budget.datBudgetDate).format('YYYY'));
        })
        req.range = 2015+" - "+2018;
        res.render('coordinator/reports/budgetCurve',{data:{budgets:budgets,budgetLabels:budgetLabels,tableData:results[0],sponsor:results[1][0],range:req.range,coordinator:req.session.user.strUserEmail}})
        
    })
})
router.route('/inbox')
    .get(func.users,(req,res)=>{
        var i = 0;
        res.locals.PanelTitle='Messages';
        db.query(`SELECT * FROM tblmessage WHERE strMReceiverId = '${req.session.user.strUserId}'`,(err,results)=>{
            if(err) throw err;
            results.forEach(ress=>{
                results[i].datMDate = moment(results[i].datMDate).format('MMM D, YYYY');
            })
            return res.render('coordinator/views/cinbox',{users:req.users,messages:results});
        })
    })
    .post((req,res)=>{
        db.query(`INSERT INTO tblmessage(strMUserId,strMReceiverId,strMSubject,strMContent,datMDate) 
        VALUES(?,?,?,?,?)`,[req.session.user.strUserId,req.body.receiver,req.body.subject,req.body.content,moment().format('YYYY-MM-DD')],(err,results,field)=>{
            if(err) throw err;
            return res.send('success');
        })
    })

router.route('/request')
    .get((req,res)=>{
        var i = 0;
        res.locals.PanelTitle='Shift Request';
        db.query(`SELECT * FROM tblrequest 
        join (tblusers,tblstudentdetails,tblcourse) 
        on (strRUserId = strUserId AND intUStudId = intStudentId AND intRCourseId = intCourseId) 
        WHERE tblrequest.enumStatus = 1`,(err,results,field)=>{
            results.forEach(ress=>{
                results[i].datRequestDate = moment(results[i].datRequestDate).format('MMM D, YYYY');
                i++;
            })
            return res.render('coordinator/views/crequest',{requests:results});
        })
    })
    .post((req,res)=>{
        db.query(`UPDATE tblrequest SET 
        enumStatus = 2
        WHERE intRequestId = ${req.body.intRequestId};
        UPDATE tblstudentdetails SET 
        intStdCourseId = ${req.body.intRCourseId}
        WHERE intStudentId = ${req.body.intStudentId}`,(err,results)=>{
            if(err) throw err;
            return res.send('success');
        })
    })
    .put((req,res)=>{
        db.query(`UPDATE tblrequest SET 
        enumStatus = 3
        WHERE intRequestId = ${req.body.intRequestId};`,(err,results,field)=>{
            if(err) throw err;
            return res.send('success');
        })
    })

router.route('/sentmail')
    .get((req,res)=>{
        res.locals.PanelTitle='Messages';
        res.render('coordinator/views/csent');
    })
router.route('/profile')
    .get((req,res)=>{
        res.locals.PanelTitle='User Profile';
        db.query(`SELECT * FROM tblusers WHERE strUserId = '${req.session.user.strUserId}'`,(err,results)=>{
            return res.render('coordinator/views/cprofile',{coordinator:results[0]});
        })
    })
    .put((req,res)=>{
        console.log(req.body);  
        db.query(`UPDATE tblusers SET
        strUserEmail = ?,
        strUserPassword = ?
        WHERE strUserId = ?`,[req.body.email,req.body.password,req.body.id],(err,results,field)=>{
            if(err) throw err;
            return res.send('success');
        })
    })



  /////////////////////
 //Sponsor Utilities//
/////////////////////
router.route('/utilities')
    .get((req,res)=>{
        res.locals.PanelTitle='Utilities';
        db.query(`SELECT * FROM tblscholarshiptype WHERE intSTId = ${req.session.user.intSchTypeId}`,(err,results,field)=>{
            return res.render('coordinator/views/cutilities',{data:results[0]});
        })
    })
    .post((req,res)=>{
        db.query(`UPDATE tblscholarshiptype SET 
        dblGradeReq = ?,
        dblIncomeReq = ?,
        dblSTAllocation = ?,
        strSTDesc = ?
        WHERE intSTId = ${req.session.user.intSchTypeId};`,[req.body.Rgrade,req.body.Rincome,req.body.Alloc,req.body.Name],(err,results,field)=>{
            if(err){
                return res.send(err);
            }
            return res.send('success');
        })
    })

exports.coordinator = router;