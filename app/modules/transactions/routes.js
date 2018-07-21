var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var db = require('../../lib/database')();

function putIcon(req,res,next){
    res.locals.PanelIcon='layers'
    return next();
}

router.use(putIcon);
router.route('/application')
    .get((req,res)=>{
        res.locals.PanelTitle='Application'
        res.render('transactions/views/t-application');
    })



exports.transaction = router;