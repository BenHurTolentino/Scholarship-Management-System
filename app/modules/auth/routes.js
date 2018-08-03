var express = require('express');
var loginRouter = express.Router();
var logoutRouter = express.Router();

var authMiddleware = require('./middlewares/auth');

loginRouter.route('/')
    .post((req, res) => {
        var db = require('../../lib/database')();

        db.query(`SELECT * FROM tblusers WHERE strStudentId="${req.body.user}"`, (err, results, fields) => {
            if (err) throw err;
            if (results.length === 0) return res.redirect('/login?incorrect');

            var user = results[0];

            if (user.strUserPassword !== req.body.password) return res.redirect('/login?incorrect');

            delete user.strUserPassword;

            req.session.user = user;

            return res.redirect('/home');
        });
    });

logoutRouter.get('/', (req, res) => {
    req.session.destroy(err => {
        if (err) throw err;
        res.redirect('/');
    });
});

exports.login = loginRouter;
exports.logout = logoutRouter;