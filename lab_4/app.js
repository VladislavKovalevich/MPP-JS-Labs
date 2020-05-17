const express = require('express');
const http  = require('http');
const {v4} = require('uuid');
var WebSocketServer = require('ws');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let pilotClass = require('./model/pilots_model');
let userClass = require('./model/users');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use(express.static('client'));

let webSocketServer = new WebSocketServer.Server({
    server
});

let pilots = [];
let filters = [];
let users = [];

initialData();

let changesFlag = false;

let clients = {};

webSocketServer.on('connection', function(ws){

    let id = v4();
    clients[id] = ws;
    console.log('Подключился клиент: ' + id);
    init(id);

    ws.on('message', function(message){
        console.log('получено новое сообщение:');
        let data = JSON.parse(message);
        console.log(data);

        let pilotReqData = {};
        let res = {};

        switch (data.type) {
            case "addPilot": {
                if (auth(data.client.token)) {
                    pilotReqData = new pilotClass(v4(), data.messageData.name, data.messageData.country, data.messageData.podiums, data.messageData.champion_wins);
                    pilots.push(pilotReqData);
                    console.log(pilots);

                    res.isDone = true;
                    res.resData = pilotReqData;
                    res.public = true;

                }else{
                    res.isDone = false;
                }
                break;
            }

            case "putPilot": {
                if (auth(data.client.token)) {
                    pilotReqData = new pilotClass(data.messageData.id, data.messageData.name, data.messageData.country, data.messageData.podiums, data.messageData.champion_wins);
                    let pilot_id = -1;
                    pilot_id = pilots.findIndex(pilot => pilot.id === pilotReqData.id);
                    if (pilot_id !== -1) {
                        pilots[pilot_id].name = pilotReqData.name;
                        pilots[pilot_id].podiums = pilotReqData.podiums;
                        pilots[pilot_id].country = pilotReqData.country;
                        pilots[pilot_id].champion_wins = pilotReqData.champion_wins;

                        res.isDone = true;
                        res.resData = pilotReqData;
                        res.public = true;
                    }
                }else{
                    res.isDone = false;
                }
                console.log(pilots);

                break;
            }

            case "deletePilot": {
                if (auth(data.client.token)) {
                    pilots = pilots.filter(pilot => pilot.id !== data.messageData);
                    res.isDone = true;
                    res.resData = data.messageData;
                    res.public = true;
                }else {
                    res.isDone = false;
                }
                break;
            }

            case "filterPilots": {
                let filter = data.messageData;

                if (filter.country.length !== 0)
                    filters = pilots.filter(pilot => pilot.country === filter.country);
                else{
                    filters = pilots;
                }
                console.log("filter pilots:" + filters);

                if (filter.firstValue > filter.secondValue){
                    let s = filter.firstValue;
                    filter.firstValue = filter.secondValue;
                    filter.secondValue = s;
                    console.log('yes');
                }

                filters = filters.filter(pilot => pilot.podiums >= filter.firstValue && pilot.podiums <= filter.secondValue);

                switch (filter.sortParam) {
                    case "Country":
                        console.log("Country");
                        filters.sort((a, b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
                        break;

                    case "Name":
                        console.log("Name");
                        filters.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
                        break;

                    case "Podiums":
                        console.log("Podiums");
                        filters.sort((a, b) => (a.podiums > b.podiums) ? -1 : ((b.podiums > a.podiums) ? 1 : 0));
                        break;

                    case "Champion wins":
                        console.log("Champion wins");
                        filters.sort((a, b) => (a.champion_wins > b.champion_wins) ? -1 : ((b.champion_wins > a.champion_wins) ? 1 : 0));
                        break;
                }

                res.public = false;
                res.resData = filters;
                res.isDone = true;

                console.log("filter pilots:" + filters);

                break;
            }

            case "register": {
                let id = -1;
                res.resData = {};
                id = users.findIndex(visitor => visitor.email === data.messageData.email);

                if (id >= 0){
                    res.isDone = false;
                    res.resData.msg = "User with this email already exists";
                }else {
                    const salt = bcrypt.genSaltSync(10);
                    const password = data.messageData.password;
                    const user = new userClass(data.messageData.email, bcrypt.hashSync(password, salt));

                    users.push(user);
                    console.log(users);

                    res.isDone = true;
                }

                res.public = false;

                break;
            }

            case "login": {
                let visitor_id = -1;
                res.resData = {};
                visitor_id = users.findIndex(visitor => visitor.email === data.messageData.email);

                if (visitor_id >= 0){
                    const passwordEven = bcrypt.compareSync(data.messageData.password, users[visitor_id].password);
                    if (passwordEven) {
                        res.resData.token = jwt.sign({
                                email: users[visitor_id].email,
                            }
                            , process.env.SECRET_KEY, {expiresIn: 60});
                        console.log("send cookie");
                    } else {
                        res.resData.msg = "Passwords don't match";
                    }
                }else{
                    res.resData.msg =  "User with this email was not found";
                }

                res.public = false;
                break;
            }
        }

        res.type = data.type;
        if (res.public === true) {

            res = JSON.stringify(res);

            console.log("to all");
            for (let key in clients) {
                clients[key].send(res);
            }
        }else{

            console.log("to one");
            res = JSON.stringify(res);
            clients[data.client.id].send(res);
        }
    });

    ws.on('close', function(){
        console.log('Соединение закрыто ' + id);
        delete clients[id]
    });
});


function auth(token){
    try {
        if (token === null){
            console.log("no token");
            throw new Error();
        }

        //let token = req.headers.authorization.replace('Bearer ', '');
        console.log(token);

        const data = jwt.verify(token, process.env.SECRET_KEY);
        console.log(data);
        let id = -1;
        id = users.findIndex(user => user.email === data.email);

        if (id === -1) {
            console.log("no client");
            throw new Error();
        }

        console.log("is valid");
        return true;
    }catch (error) {
        console.log("Unauthorized");
        return false;
    }
}

function init(id) {
    let initData = {};
    initData.clientID = id;
    initData.type = "initFront";
    initData.resData = pilots;

    initData = JSON.stringify(initData);
    clients[id].send(initData);
}

function initialData(){
    users.push(new userClass(null,"member@tut.by", bcrypt.hashSync("12343210", bcrypt.genSaltSync(10))));
    users.push(new userClass(null,"vlad@tut.by", bcrypt.hashSync("12345678", bcrypt.genSaltSync(10))));

    pilots.push(new pilotClass(v4(), "Nico Rosberg", "Germany", 34, 1));
    pilots.push(new pilotClass(v4(), "Sebastian Vettel", "Germany", 54, 4));
    pilots.push(new pilotClass(v4(), "Lewis Hamilton", "England", 71, 6));
    pilots.push(new pilotClass(v4(), "Nigel Mansell", "England", 37, 1));

}

server.listen(process.env.PORT || 4000, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});