var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');

router.route('/')
.get((req,res)=>{
    res.locals.PanelTitle='User Profile';
    res.render('profile/views/profile');
})

exports.profile = router;