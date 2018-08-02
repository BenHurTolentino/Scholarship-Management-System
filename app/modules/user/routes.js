var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');

router.route('/')
.get((req,res)=>{
    res.locals.PanelTitle='Dashboard';
    res.render('user/views/home');
})
router.route('/profile')
.get((req,res)=>{
    res.locals.PanelTitle='User Profile';
    res.render('user/views/profile');
})
router.route('/message')
.get((req,res)=>{
    res.locals.PanelTitle='Messages';
    res.render('user/views/message');
})
router.route('/accounts')
.get((req,res)=>{
    res.locals.PanelTitle='Account';
    res.render('user/views/accounts');
})

exports.user = router;