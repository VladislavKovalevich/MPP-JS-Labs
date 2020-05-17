let addBtn, putBtn, searchBtn;
let pilotId;
let token = "ereQR124ERwqgWOEQIFHdwuefhe";

window.onload = async function(){
    const data = await clientRequest("/api/pilots", "GET");
    console.log(data);

    for (let i = 0; i< data.length; i++) {
        getCard(data[i]);
    }

   addBtn = document.getElementById("btnID").onclick = async function () {
        let pilot = {};
        pilot.name = document.getElementById("name").value;
        pilot.country = document.getElementById("country").value;
        pilot.podiums = document.getElementById("wins").value;
        pilot.champion_wins = document.getElementById("champ_wins").value;

        const response = await clientRequest("/api/pilots", "POST", pilot);

        if (response.message === "Unauthorized user"){
            alert("Ошибка 401, пользователь не авторизован");
        }else {
            getCard(response);
            console.log(response);
        }
   };

   putBtn = document.getElementById("updateData").onclick = async function () {
       let pilot = {};

       pilot.id = pilotId;
       pilot.name = document.getElementById("nameUpdate").value;
       pilot.country = document.getElementById("countryUpdate").value;
       pilot.podiums = document.getElementById("winsUpdate").value;
       pilot.champion_wins = document.getElementById("champ_winsUpdate").value;

       const response = await clientRequest(`/api/pilots/${pilotId}`, "PUT", pilot);

       if (response.message === "Unauthorized user"){
           alert("Ошибка 401, пользователь не авторизован");
       }else {
           const elem = document.getElementsByClassName(pilotId.toString())[0];
           const elements = document.getElementsByClassName("pilot-card-fxv");

           for (let i = 0; i < elements.length; i++){
               if (elements[i] === elem){
                   getCard(response, i);
               }
           }
       }
   };

   searchBtn = document.getElementById("searchPilotBtn").onclick = async function () {
        let filterObject = {};

        filterObject.country = document.getElementById("countryFilter").value;
        filterObject.firstValue = document.getElementById("first_number").value;
        filterObject.secondValue = document.getElementById("second_number").value;
        filterObject.sortParam = document.getElementById("sortParamSelect").value;
        console.log(filterObject);

        const response = await clientRequest('/api/pilots/filter', "POST", filterObject);

        document.getElementById('pilots').innerHTML = '';
        for (let i = 0; i < response.length; i++) {
            getCard(response[i]);
        }
   };
};

async function Delete (id){
    const response = await clientRequest(`/api/pilots/${id}`, "DELETE");
    if (response.message !== "Unauthorized user")
        document.getElementsByClassName(id.toString())[0].remove();
    else {
        alert("Ошибка 401, пользователь не авторизован");
    }
}

function Update(id, name, country, wins, ch_wins) {
    pilotId = id;
    document.getElementById("nameUpdate").value = name;
    document.getElementById("countryUpdate").value = country;
    document.getElementById("winsUpdate").value = wins;
    document.getElementById("champ_winsUpdate").value = ch_wins;
}

async function auth(email, password, flag = false) {
    const user = {};
    user.email = email;
    user.password = password;

    console.log(user);
    let response;

    if (flag) {
        console.log("reg");
        response = await clientRequest("/register", "POST", user);
        document.getElementById('reg-auth-Modal').modal = "hide";
    } else {
        console.log("auth");
        response = await clientRequest("/login", "POST", user);
        console.log(response);
        console.log(get_cookie("token"));
        //token = response.token;
    }

    if(response.message) {
        document.getElementById('warning').style.display = "block";
        document.getElementById('warning').innerText = response.message;
        document.getElementById('auth-reg').style.display = "none";
    }else {
        document.getElementById('auth-reg').style.display = "block";

        if (flag)
            document.getElementById('auth-reg').innerText = "The user is registered";
        else
            document.getElementById('auth-reg').innerText = "The user is logged in";

        document.getElementById('warning').style.display = "none";

        document.getElementById('passwordField').value = "";
        document.getElementById('emailField').value = "";
    }

}

function get_cookie ( cookie_name )
{
    let results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );

    if ( results )
        return ( unescape ( results[2] ) );
    else
        return null;
}

async function clientRequest(url, method, data = null) {
    try {
        let headers = {};
        headers['Authorization'] = get_cookie("token");//.replace("token=Bearer%20","");
        //console.log(headers['Authorization']);

        let body;

        if (data) {
            headers['Content-type'] = 'application/json';
            body = JSON.stringify(data);
        }

        const response = await fetch(url, {
            method,
            headers,
            body
        });

        return await response.json();
    } catch (e) {
        console.warn(e.message);
    }
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
    }else{
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
