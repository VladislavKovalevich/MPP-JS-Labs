const file = require('fs');

function Task(name, description) {
        this.name = name,
        this.description = description
}

taskArr = [];
file.readFile("dbFile1.txt", "utf8",
    function (error, data) {
            console.log("файл прочитан");
            if (error) throw error;
            console.log(data);
            let tasks = data.split('\n');
            for (let i = 0; i < tasks.length - 1; i++){
                    let taskDecs = tasks[i].split('|');
                    taskArr.push(new Task(taskDecs[0], taskDecs[1]));
            }

    });
module.exports = {taskArr, Task};