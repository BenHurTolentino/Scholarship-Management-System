var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');

router.route('/')
.get((req,res)=>{
    res.locals.PanelTitle='News Feed';
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
router.route('/sentmail')
.get((req,res)=>{
    res.locals.PanelTitle='Messages';
    res.render('user/views/sentmail');
})
router.route('/request')
.get((req,res)=>{
    res.locals.PanelTitle='Shift Request';
    res.render('user/views/request');
})

exports.user = router;