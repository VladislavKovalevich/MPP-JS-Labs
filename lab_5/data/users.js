const bcrypt = require('bcrypt');

const Users = [
    {
        email: "member@tut.by",
        password: bcrypt.hashSync("12343210", bcrypt.genSaltSync(10))
    },
    {
        email: "admin@tut.by",
        password: bcrypt.hashSync("11111111", bcrypt.genSaltSync(10))
    },
    {
        email: "vlad@tut.by",
        password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10))
    },
    {
        email: "email@yahoo.by",
        password: bcrypt.hashSync("87654321", bcrypt.genSaltSync(10))
    }
];

module.exports = Users;
