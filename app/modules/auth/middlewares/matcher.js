var db = require('../../../lib/database')();
var moment = require('moment');
var logic = require('../../transactions/logic/trasaction-logic');

exports.match = (req,res,next) =>{
    db.query(`SELECT * FROM tblsettings`,(err,results,field)=>{
        logic.match();
        return next();
    })
}