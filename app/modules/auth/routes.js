var express = require('express');
var loginRouter = express.Router();
var logoutRouter = express.Router();
var recoveryRouter = express.Router();
var authMiddleware = require('./middlewares/auth');
var db = require('../../lib/database')();
var nodemailer = require('nodemailer');

loginRouter.route('/')
    .post((req, res) => {
        

        db.query(`SELECT * FROM tblusers WHERE strUserId="${req.body.user}"`, (err, results, fields) => {
            if (err) throw err;
            if (results.length === 0) return res.redirect('/login?incorrect');

            var user = results[0];

            if (user.strUserPassword !== req.body.password) 
            
            return res.redirect('/login?incorrect');

            delete user.strUserPassword;

            req.session.user = user;
            console.log(req.session.user);
            if(req.session.user.enumUserType == 'admin')
            return res.redirect('/home');
            else if(req.session.user.enumUserType == 'coordinator')
            return res.redirect('/coordinator');
            else
            return res.redirect('/user');
        });
    });

recoveryRouter.route('/')
    .post((req,res)=>{
        db.query(`SELECT * FROM tblusers WHERE strUserEmail = "${req.body.email}"`,(err,results,field)=>{
            var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl + '/' + results[0].token;
            var content = `<h3>To reset your password for your account, use the following link</h3>
                           <p><a href="${fullUrl}">${fullUrl}<a/></p>
                           <hr>
                            <p>Please ignore this message if you didn't request for this</p>` 
            var transporter = nodemailer.createTransport({
                service : 'gmail',
                auth : {
                    user:'ganilayow@gmail.com',
                    pass:'mastersensei'
                }
            });
            const mailOptions = {
                from: '"Scholarship Management System" <ganilayow@gmail.com>',
                to: req.body.email,
                subject: 'Account Recovery',
                html: content
            }
            transporter.sendMail(mailOptions,function(err,info){
                if(err)
                    console.log(err);
                else
                    console.log(info);
            });
            return res.redirect('/');

        });
    })
recoveryRouter.route('/:token')
    .get((req,res)=>{
        db.query(`SELECT token from tblusers WHERE token = "${req.params.token}"`,(err,results,field)=>{
            res.render('home/views/recovery',{data:results[0]});
        });
    })
    .post((req,res)=>{
        db.query(`UPDATE tblusers SET
        strUserPassword = "${req.body.Pword}"
        WHERE token = '${req.params.token}'`,(err,results,field)=>{
            return res.redirect('/');
        })
    })


logoutRouter.get('/', (req, res) => {
    req.session.destroy(err => {
        if (err) throw err;
        res.redirect('/');
    });
});


exports.login = loginRouter;
exports.logout = logoutRouter;
exports.recovery = recoveryRouter;