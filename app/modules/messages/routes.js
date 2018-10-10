var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');

router.route('/inbox')
.get((req,res)=>{
    res.locals.PanelTitle='Messages';
    res.render('messages/views/messages');
})

router.route('/sentmail')
.get((req,res)=>{
    res.locals.PanelTitle='Messages';
    res.render('messages/views/sent');
})



exports.messages = router;