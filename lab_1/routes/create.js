var express = require('express');
var router = express.Router();
var {taskArr, Task} = require('../model/model');
const bodyParser = require('body-parser');
const file = require('fs');


const urlencodedParser = bodyParser.urlencoded({extended: false});

router.get('/', function(req, res){
    res.render('create', {title: 'Create task'})
});


router.post('/',urlencodedParser, function(req, res){
    if (req.body.NameOfProduct.length !== 0 && req.body.AboutProduct.length !== 0 && req.body.AboutProduct.length !== 0) {

        taskArr.push(new Task(
            req.body.NameOfProduct,
            req.body.AboutProduct));

        //let string = `${req.body.NameOfProduct}|${req.body.AboutProduct}\n`;

        res.redirect('/tasks')
    }else{
        res.redirect('/create')
    }


});

module.exports = router;
