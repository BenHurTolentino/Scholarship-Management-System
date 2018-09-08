var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');

router.route('/')
.get((req,res)=>{
    res.locals.PanelTitle='Dashboard';
    res.render('sponsor/views/s-home');
})
router.route('/profile')
.get((req,res)=>{
    res.locals.PanelTitle='User Profile';
    res.render('sponsor/views/s-profile');
})
router.route('/grade')
.get((req,res)=>{
    res.locals.PanelTitle='Grade';
    res.render('sponsor/views/s-grade');
})
router.route('/course')
.get((req,res)=>{
    res.locals.PanelTitle='Course';
    res.render('sponsor/views/s-course');
})
router.route('/district')
.get((req,res)=>{
    res.locals.PanelTitle='District';
    res.render('sponsor/views/s-district');
})
router.route('/income')
.get((req,res)=>{
    res.locals.PanelTitle='Income';
    res.render('sponsor/views/s-income');
})
router.route('/school')
.get((req,res)=>{
    res.locals.PanelTitle='School';
    res.render('sponsor/views/s-school');
})
router.route('/message')
.get((req,res)=>{
    res.locals.PanelTitle='Message';
    res.render('sponsor/views/s-message');
})

exports.sponsor = router;