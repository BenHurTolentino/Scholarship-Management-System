var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');


router.route('/')
.get((req,res)=>{
    res.render('budget/views/budget');
})
exports.budget = router;