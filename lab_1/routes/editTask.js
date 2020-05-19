var express = require('express');
var router = express.Router();
var {taskArr, Task} = require('../model/model');
const bodyParser = require('body-parser');
const file = require('fs');

const urlencodedParser = bodyParser.urlencoded({extended: false});

router.post("/", urlencodedParser, function (req, res) {
    const prodName = req.body.productNameEdit;
    let index = -1;

    console.log("prod edit = " + prodName);
    index = taskArr.findIndex(el => el.name === prodName)


    if (index !== -1){
        taskArr[index].name = req.body.newProductName;
        taskArr[index].description = req.body.newAboutProduct;
        taskArr[index].date = req.body.newAboutProduct;
    }else{
        console.log("not found");
    }

    res.render('tasks', {title: 'Tasks', taskArr});
});



module.exports = router;