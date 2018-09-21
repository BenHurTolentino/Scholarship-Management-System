var db = require('../../../lib/database')();
var moment = require('moment');
var logic = require('../../transactions/logic/trasaction-logic');

exports.match = (req,res,next) =>{
    db.query(`SELECT * FROM tblsettings`,(err,results,field)=>{
        if(results[0].datApplydate!=null){
            if(moment(results[0].datApplydate).format('YYYY-MM-D') <= moment().format('YYYY-MM-D')){
                logic.match();
                return next();
            }
        }
        return next();
    })
}