var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');

router.route('/')
.get((req,res)=>{
    res.locals.PanelTitle='Announcement';
    res.render('announcement/views/announcement');
})

exports.announcement = router;