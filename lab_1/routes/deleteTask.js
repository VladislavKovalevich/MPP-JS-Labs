var express = require('express');
var router = express.Router();
var {taskArr, Task} = require('../model/model');
const bodyParser = require('body-parser');
const file = require('fs');

const urlencodedParser = bodyParser.urlencoded({extended: false});

router.post("/",urlencodedParser, function (req, res) {
    const prodName = req.body.productName;
    let index = -1;

    index = taskArr.findIndex(el => el.name === prodName)

    if (index !== -1) {
        taskArr.splice(index, 1)
        console.log("is deleted")
    }else{
        console.log("not found");
    }

    res.render('tasks', {title: 'Tasks', taskArr});
});

module.exports = router;
