var nodemailer = require('nodemailer');
exports.mail = (content,receivers,subject) =>{
    var transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    });
    const mailOptions = {
        from: `"Scholarship Management System" <${process.env.EMAIL_USER}>`,
        to: receivers,
        subject: subject,
        html: content
    }
    transporter.sendMail(mailOptions,function(err,info){
        if(err)
            console.log(err);
        else
            console.log(info);
    });
}