var express = require('express');
var db = require('../../../lib/database')();
var moment = require('moment')
var mailer = require('../../auth/functions/mailer');
var match = require('../../auth/functions/matching')

function setApply(match,files){
    for(var i=0;i<files.length;i++){
        db.query(`INSERT INTO tblstudentreq(intARStudId,intARRId,isSubmitted) 
        VALUES(${match.student},${files[i].intSRId},0)`,(err,results,field)=>{
            if(err) throw err;
        })
    }
    db.query(`SELECT * FROM tblscholarshipreq JOIN(tblrequirements) ON (intSRRId = intRequirementId) WHERE intSRSTID=${match.sponsor} AND enumReqType=1;
    SELECT strSTDesc FROM tblscholarshiptype WHERE intSTId = ${match.sponsor};
    SELECT strStudentEmail FROM tblstudentdetails WHERE intStudentId = ${match.student};`,(err,results,field)=>{
        var requirements="";
        var x=0;
        results[0].forEach(function(){
            requirements += `<li><b>${results[0][x].strRequirementDesc}</b></li>\n`
            x++
        });
        var date = moment().add(14,'day').format('MMMM D,YYYY');
        
        var content = `
        <p style="font-size: 12pt;">This is to inform you that the Scholarship Management System has accepted your application for a scholarship in our ${results[1][0].strSTDesc} Scholarship Type program after carefully considering your application, academic achievements, previous marks and financial condition. We have decided that you will be a valuable addition to our program.</p>
        <p style="font-size: 12pt;>But in order to continue getting the scholarship, you must first submit the following to our main office:</p>
        <ol style="font-size: 10pt;">
        ${requirements}
        </ol>
        <p style="font-size: 12pt;"> You have until <b>${date}</b> to submit the following. Please be informed of the strict deadline.</p>
        <hr>
        <p style="color: rgba(0, 0, 0, 0.3);font-size: 16pt;"><i> *** THIS IS A SYSTEM GENERATED EMAIL.  PLEASE DO NOT REPLY TO THIS MESSAGE. *** </i></p>`
        var receivers = results[2][0].strStudentEmail;
        var subject = 'Scholarship Application';
        mailer.mail(content,receivers,subject);
    })
}
exports.match = ()=>{
    var scholarship = [];
    var courses = [];
    var schools = [];
    var districts = [];
    var students = [];
    var matches = [];
    var declined = [];
    db.query(`SELECT intSTId,intslots,dblGradeReq,dblIncomeReq FROM tblscholarshiptype join tblbudget on (intBSTId = intSTId) WHERE enumBudgetStatus = 2;
    SELECT * from tblsponsorcourse;
    SELECT * from tblsponsordistrict;
    SELECT * from tblsponsorschool;
    select distinct intStudentId,dblEducGA,dblStudentFIncome,intBDistrictId,intStdSchoolId,intStdCourseId
    from tblstudentdetails sd join(tblbarangay tb,tbleducbg te) on (intSBarangayId = intBarangayId AND intStudentId = intEBGStudId) left join (tblstudentreq ar) 
    on sd.intStudentId = ar.intARStudId
    WHERE intARId is null and enumStudentStat = 1;`,(err,results,field)=>{
        if(results[4].length != 0){
            results[4].forEach(result=>{
                students.push({studId:result.intStudentId,grade:result.dblEducGA,income:result.dblStudentFIncome,district:result.intBDistrictId,school:result.intStdSchoolId,course:result.intStdCourseId})
            })
            results[0].forEach(result=>{
                results[1].forEach(course=>{
                    if(course.intSponsorId == result.intSTId){
                        courses.push(course.intSCourseId);
                    }
                })
                results[2].forEach(district=>{
                    if(district.intSponsorId == result.intSTId){
                        districts.push(district.intSDistrictId);
                    }
                })
                results[3].forEach(school=>{
                    if(school.intSponsorId == result.intSTId){
                        schools.push(school.intSSchoolId);
                    }
                })
                scholarship.push({id:result.intSTId,slots:result.intslots,gradeReq:result.dblGradeReq,incomeReq:result.dblIncomeReq,courses:courses,schools:schools,districts:districts});
            })
            matches = match.main(students,scholarship)
            declined = matches[1];
            matches = matches[0];
            
            matches.forEach(match=>{
                db.query(`SELECT * FROM tblscholarshipreq WHERE intSRSTId = ${match.sponsor}`,(err,results,field)=>{
                    setApply(match,results);
                })
            })
            declined.forEach(decline=>{
                db.query(`SELECT strStudentEmail FROM tblstudentdetails WHERE intStudentId = ${decline.student};
                UPDATE tblstudentdetails SET enumStudentStat = 3,enumStatus = 2 WHERE intStudentId = ${decline.student};`,(err,results,field)=>{
                    var content = `<p style="font-size: 12pt;">Greetings! This is Scholarship Management System. You are unfit for any scholarship in our records</p>
                    <hr>
                    <p style="color: rgba(0, 0, 0, 0.3);font-size: 16pt;"><i> *** THIS IS A SYSTEM GENERATED EMAIL.  PLEASE DO NOT REPLY TO THIS MESSAGE. *** </i></p>`
                    var receivers = results[0][0].strStudentEmail;
                    var subject = 'Scholarship Application';
                    mailer.mail(content,receivers,subject);
                });
            })
        }
    })
}