//define objects
var student = []
var sponsor = []

var temporary_match = []; //temporary variable for holding matches
var free_student = []; //list of pending students
var declined_student = []; //list of unmatched students

//get all unmatched student
function initialize_student(){
    student.forEach(studs=>{
        free_student.push(studs);
    });
}

//match student a scholarship
function match_student(){
    while(free_student.length > 0){
        free_student.forEach(student=>{
            begin_matching(student);
        })
    }
}
function begin_matching(student){
    var index = free_student.indexOf(student);
    var checks = 0;
    var districtCheck=0;
    var schoolCheck=0;
    var courseCheck=0;
    var studentCheck=0;
    for(var i=0;i<sponsor.length;i++){
        console.log('matching '+student.studId+' with '+sponsor[i].id);
        var taken_match=[];
        temporary_match.forEach(temps=>{
            if(temps.sponsor.id == sponsor[i].id){
                taken_match.push(temps);
            }
        })
        if(sponsor[i].slot != taken_match.length){
            districtCheck=check_district(sponsor[i],student);
            schoolCheck=check_school(sponsor[i],student);
            courseCheck=check_course(sponsor[i],student);
            if(student.grade >= sponsor[i].gradeReq && student.income <= sponsor[i].incomeReq && districtCheck==1 && schoolCheck==1 && courseCheck==1){
                temporary_match.push({sponsor:sponsor[i].id,student:student.studId});
                free_student.splice(index,1);
                console.log('MATCHED:'+student.studId+' AND '+sponsor[i].id);
                break;
            }
            else{
                checks++;
                console.log(student.studId+' requirements not met!');
            }    
        }
        else{
            districtCheck=check_district(sponsor[i],student);
            schoolCheck=check_school(sponsor[i],student);
            courseCheck=check_course(sponsor[i],student);
            if(student.grade >= sponsor[i].gradeReq && student.income <= sponsor[i].incomeReq && districtCheck==1 && schoolCheck==1 && courseCheck==1){
                studentCheck=check_student(student,taken_match);
                if(studentCheck==1){
                    temporary_match.push({sponsor:sponsor[i].id,student:student.studId});
                    free_student.splice(index,1);
                    console.log('MATCHED:'+student.studId+' AND '+sponsor[i].id);
                    break;
                }
                else{
                    console.log('pasado pero di kinaya');
                    checks++;
                }
            }
            else{
                checks++;
                console.log(student.studId+' requirements not met!');
            }
        }
        if(sponsor.length == checks){
            console.log(student.studId+' is unfit for any scholarship');
            declined_student.push({student:student.studId});
            free_student.splice(index,1);
        }
    }
}
function check_district(sponsor,student){
    for(var i=0;i<sponsor.districts.length;i++){
        if(student.district == sponsor.districts[i]){
            return 1;
        }
    }
    return 0;
}
function check_school(sponsor,student){
    for(var i=0;i<sponsor.schools.length;i++){
        if(student.school == sponsor.schools[i]){
            return 1;
        }
    }
    return 0;
}
function check_course(sponsor,student){
    for(var i=0;i<sponsor.courses.length;i++){
        if(student.course == sponsor.courses[i]){
            return 1;
        }
    }
    return 0;
}
function check_student(student,taken_student){
    for(var i=0;i<taken_student.length;i++){
        console.log('comparing with '+taken_student[i].student.studId);
        if(student.grade > taken_student[i].student.grade && student.income < taken_student[i].student.income){
            free_student.push(taken_student[i].student);
            console.log(taken_student[i].student.studId+' is free again');
            var index = temporary_match.indexOf(taken_student);
            temporary_match.splice(index,1);
            return 1;
        }
    }
    return 0;
}

exports.main = (student_data,scholarship_data)=>{
    var results = [];
    temporary_match = [];
    declined_student = [];
    student = student_data;
    sponsor = scholarship_data;
    console.log(student);
    console.log(sponsor);
    initialize_student();
    match_student();
    results.push(temporary_match,declined_student);
    return results;
}