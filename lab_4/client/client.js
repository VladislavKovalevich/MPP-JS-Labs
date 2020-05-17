var socket = new WebSocket("ws://localhost:4000");
var addBtn, putBtn, getCorrectBtn;
let pilotId;
let client = {};

window.onload = function () {
    addBtn = document.getElementById("btnID").onclick = async function () {
        let pilot = {};
        pilot.name = document.getElementById("name").value;
        pilot.country = document.getElementById("country").value;
        pilot.podiums = document.getElementById("wins").value;
        pilot.champion_wins = document.getElementById("champ_wins").value;

        sendMessageToServer(client, pilot, "addPilot");
    };

    putBtn = document.getElementById("updateData").onclick = async function () {
        let pilot = {};

        pilot.id = pilotId;
        pilot.name = document.getElementById("nameUpdate").value;
        pilot.country = document.getElementById("countryUpdate").value;
        pilot.podiums = document.getElementById("winsUpdate").value;
        pilot.champion_wins = document.getElementById("champ_winsUpdate").value;

        sendMessageToServer(client, pilot,  "putPilot");
    };

    getCorrectBtn = document.getElementById("getCorrectData").onclick = async function () {
        let filterObject = {};

        filterObject.country = document.getElementById("countryFilter").value;
        filterObject.firstValue = document.getElementById("first_number").value;
        filterObject.secondValue = document.getElementById("second_number").value;
        filterObject.sortParam = document.getElementById("sortParamSelect").value;
        console.log(filterObject);

        sendMessageToServer(client, filterObject, "filterPilots");
    };
};

// обработчик сообщений с сервера
socket.onmessage = function(event) {
    var resMessage = event.data;

    let res = JSON.parse(resMessage);

    switch (res.type) {
        case "initFront": {
            client.id = res.clientID;
            client.token = null;
            let pilots = res.resData;

            //pilotsList = res.resData;
            for (let i = 0; i < pilots.length; i++){
                getCard(pilots[i]);
            }

            break;
        }

        case "addPilot": {
            if (res.isDone){
                getCard(res.resData);
            }else {
                alert("User is unauthorized");
            }
            break;
        }

        case "deletePilot": {
            if (res.isDone){
                console.log("is deleted");
                document.getElementsByClassName(res.resData.toString())[0].remove();
            }else{
            alert("User is unauthorized");
            }
            break;
        }

        case "putPilot": {
            if (res.isDone){
                console.log("PUT is Done: "+ res.resData);
                const elem = document.getElementsByClassName(res.resData.id.toString())[0];
                const elements = document.getElementsByClassName("pilot-card-fxv");

                for (let i = 0; i < elements.length; i++){
                    if (elements[i] === elem){
                        getCard(res.resData, i);
                    }
                }
            }else{
                alert("User is unauthorized");
            }
            break;
        }

        case "filterPilots": {
            if (res.isDone) {
                document.getElementById('pilots').innerHTML = '';
                for (let i = 0; i < res.resData.length; i++) {
                    getCard(res.resData[i]);
                }
            }

            break;
        }

        case "login": {
            if (res.resData.msg){
                document.getElementById('warning').style.display = "block";
                document.getElementById('warning').innerText = res.resData.msg;
                document.getElementById('auth-reg').style.display = "none";
            }else {
                document.getElementById('auth-reg').style.display = "block";
                document.getElementById('auth-reg').innerText = "The user is logged in";
                document.getElementById('warning').style.display = "none";

                document.getElementById('passwordField').value = "";
                document.getElementById('emailField').value = "";

                let date = new Date(Date.now() + 3660e3);
                date = date.toUTCString();
                document.cookie = "Token" + '=' + res.resData.token + "; path=/; expires="+ date ;
                console.log(res.resData.token);
            }

            break;
        }

        case "register": {
            console.log(res);
            if (res.resData.msg) {
                document.getElementById('warning').style.display = "block";
                document.getElementById('warning').innerText = res.resData.msg;
                document.getElementById('auth-reg').style.display = "none";
            }else {
                document.getElementById('auth-reg').style.display = "block";
                document.getElementById('auth-reg').innerText = "The user is registered";
                document.getElementById('warning').style.display = "none";

                document.getElementById('passwordField').value = "";
                document.getElementById('emailField').value = "";
            }
        }
    }
};

function sendMessageToServer(client, mesData, type) {
    let message = {};

    client.token = get_cookie("Token");

    message.client = client;
    message.messageData = mesData;
    message.type = type;

    let data = JSON.stringify(message);
    socket.send(data);
}

function Update(pilot_id, name, country, wins, ch_wins) {
    pilotId = pilot_id;
    document.getElementById("nameUpdate").value = name;
    document.getElementById("countryUpdate").value = country;
    document.getElementById("winsUpdate").value = wins;
    document.getElementById("champ_winsUpdate").value = ch_wins;
}


function Delete(pilot_id) {
    sendMessageToServer(client, pilot_id, "deletePilot");
}

function reg(email, password) {
    const user = {};
    user.email = email;
    user.password = password;

    console.log(user);

    console.log("reg");
    sendMessageToServer(client, user, "register");
    document.getElementById('reg-auth-Modal').modal = "hide";
}

function login(email, password) {
    const user = {};
    user.email = email;
    user.password = password;

    console.log(user);

    console.log("reg");
    sendMessageToServer(client, user, "login");
    document.getElementById('reg-auth-Modal').modal = "hide";
}

function get_cookie ( cookie_name )
{
    let results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );

    if ( results )
        return ( unescape ( results[2] ) );
    else
        return null;
}

function getCard(pilot, position = null) {
    if (position === null) {
        const x = ` <div class="col-6 py-md-2 ${pilot.id} pilot-card-fxv">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title" id="name">${pilot.name}</h5>
                                <h6 class="card-subtitle mb-2 text-muted" id="country">${pilot.country}</h6>

                                <div id="wins">Podiums: ${pilot.podiums}</div>
                                <div id="champ_wins">Championships wins: ${pilot.champion_wins}</div>

                                <hr>

                                <button type="button" class="btn btn-danger" id="deleteBtn" onclick="Delete('${pilot.id}')">Delete</button>
                                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal" id="putBtn" onclick="Update('${pilot.id}','${pilot.name}','${pilot.country}', '${pilot.podiums}', '${pilot.champion_wins}')">Update</button>
                            </div>
                        </div> 
                    </div>`;
        document.getElementById('pilots').innerHTML = document.getElementById('pilots').innerHTML + x;
    }  else{
        document.getElementsByClassName('pilot-card-fxv')[position].innerHTML = `<div class="card">
                            <div class="card-body">
                                <h5 class="card-title" id="name">${pilot.name}</h5>
                                <h6 class="card-subtitle mb-2 text-muted" id="country">${pilot.country}</h6>

                                <div id="wins">Podiums: ${pilot.podiums}</div>
                                <div id="champ_wins">Championships wins: ${pilot.champion_wins}</div>

                                <hr>

                                <button type="button" class="btn btn-danger" id="deleteBtn" onclick="Delete('${pilot.id}')">Delete</button>
                                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal" id="putBtn" onclick="Update('${pilot.id}','${pilot.name}','${pilot.country}', '${pilot.podiums}', '${pilot.champion_wins}')">Update</button>
                            </div>
                        </div>`;
    }
}



