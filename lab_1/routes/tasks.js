var express = require('express');
var router = express.Router();
var {taskArr, Task} = require('../model/model')
const bodyParser = require('body-parser');

const urlencodedParser = bodyParser.urlencoded({extended: false});
var sortFlag = true;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('tasks', { title:'Tasks', taskArr});
});

router.post('/', urlencodedParser, function (req, res) {
  var selected = req.body.sortSelect

  console.log(`seleted value is ${selected}`)

  switch (selected) {
    case "name": {
        taskArr.sort((a, b) => {
          if (a.name < b.name) {
            return -1
          } else
            return 1;
        });
      break;
    }
    case "about": {
        taskArr.sort((a, b) => {
          if (a.description < b.description) {
            return -1
          } else
            return 1;
        });
      break;
    }
  }
  console.log(`sortflag = ${sortFlag}\n`);

  res.render('tasks', {title: 'Tasks', taskArr});
})

module.exports = router;
