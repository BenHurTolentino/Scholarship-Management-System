var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var db = require('../../lib/database')();
var func = require('../auth/functions/transactions');

router.route('/')
.get((req,res)=>{
    res.render('home/views/index');
})

router.route('/home')
.get((req,res)=>{
    res.render('home/views/home');
});


router.route('/apply')
.get(func.barangay,func.school,func.course,(req,res)=>{
    res.render('home/views/apply',{barangay:req.barangay, schools:req.schools, courses:req.course});
});

exports.index = router;