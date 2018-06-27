var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');

router.route('/')
.get((req,res)=>{
    res.render('home/views/index');
})



router.route('/home')
.get((req,res)=>{
    res.render('home/views/home');
});


router.route('/apply')
.get((req,res)=>{
    res.render('home/views/apply');
});
exports.index = router;