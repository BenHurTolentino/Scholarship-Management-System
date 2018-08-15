exports.counter = (type,scholarship,num) => {
    var head;
    var intChange;
    var id;
    var slice;
    var userId;
    if(type == 'coordinator'){
        head = 'sms';
    }
    else if(type == 'student'){
        var today = new Date();
        head = today.getFullYear();
    }
    console.log(head);
    if(num!=''){
        slice = num.split('-');
        var strChange = slice[1];
        intChange = Number(strChange);
        intChange++;

        var strIntChange = String(intChange);
        var strnewChange = "";
        if(strIntChange.length != strChange.length){
            intCounter = 0;
            while(strChange.length > (strnewChange.length + strIntChange.length)){
                strnewChange = strnewChange.concat("0");
            }
        }
        id = strnewChange.concat(strIntChange);

    }
    else{
        id='00001';
    }
    console.log(id);
    
    userId = head + '-' + id + '-' + scholarship;
    console.log('old ID: ' + num)
    console.log('new ID: '+userId);
    return userId;
}