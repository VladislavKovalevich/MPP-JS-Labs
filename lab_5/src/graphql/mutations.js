const {v4} = require('uuid');
const _ = require('lodash');
const { GraphQLNonNull, GraphQLObjectType, GraphQLList, GraphQLString } = require('graphql');
const b_crypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
    UserType,
    UserRegType,
    UserLogType,
    PilotType,
    PilotCreateType,
    PilotDeleteType,
    PilotUpdateType,
    PilotSortType,
    MessageType
} = require('./types.js');

let Pilots = require('../../data/pilots');
let Users = require('../../data/users');

function auth(headers) {
    if (headers.authorization){
        let token = headers.authorization;
        let user = jwt.verify(token, 'SECRET_KEY');
        console.log(user);
        if (user){
            return true;
        }else
        {
            return false;
        }
    }else {
        return false;
    }
}

const MainMutationType = new GraphQLObjectType({
    name: 'MainMutationType',
    description: 'Mutations for MainType',
    fields: {
        createPilot: {
            type: PilotType,
            args: {
                input: { type: new GraphQLNonNull(PilotCreateType) }
            },

            resolve: (source, { input }, context) => {
                //console.log(req.headers.authorization);
                //req.status.json()
                //console.log(context.user);
                if (auth(context.user)) {
                    let pilot = [];
                    pilot.id = v4();
                    pilot.name = input.name;
                    pilot.country = input.country;
                    pilot.podiums = input.podiums;
                    pilot.champion_wins = input.champion_wins;
                    Pilots.push(pilot);
                    return pilot;
                }else {
                    return null;
                }
            }
        },

        deletePilot: {
            type: PilotType,
            args: {
                input: {type: new GraphQLNonNull(PilotDeleteType) }
            },
            resolve: (source, { input }, context) => {
                //console.log(req.headers.authorization);
                //console.log(input);
                if (auth(context.user)) {
                    let deletePilot = _.remove(Pilots, pilot => pilot.id === input.id);
                    return input;
                }else{
                    return null;
                }

            }
        },

        updatePilot: {
            type: PilotType,
            args: {
                input: {type: new GraphQLNonNull(PilotUpdateType) }
            },
            resolve: (source, { input }, context) => {
               // console.log(req.headers.authorization);
                if (auth(context.user)) {
                    let pilotId = -1;

                    pilotId = Pilots.findIndex(pilot => pilot.id === input.id);
                    if (pilotId > -1) {
                        Pilots[pilotId].name = input.name;
                        Pilots[pilotId].country = input.country;
                        Pilots[pilotId].podiums = input.podiums;
                        Pilots[pilotId].champion_wins = input.champion_wins;
                    }

                    return Pilots[pilotId];
                }else{
                    return null;
                }
            }
        },

        sortPilots: {
            type: new GraphQLList(PilotType),
            args: {
                input: {type: new GraphQLNonNull(PilotSortType)}
            },
            resolve: (source, { input }) => {
                let pilots;// = Pilots;

                if (input.countryFilter.length === 0){
                    pilots = Pilots;
                }else{
                    pilots = Pilots.filter(pilot => pilot.country === input.countryFilter);
                }

                pilots = pilots.filter(pilot => pilot.podiums >= input.firstValue && pilot.podiums <= input.secondValue);

                switch (input.sortParam) {
                    case "Name": {
                        pilots.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
                        break;
                    }
                    case "Country": {
                        pilots.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
                        break;
                    }
                    case "Podiums": {
                        pilots.sort((a,b) => (a.podiums > b.podiums) ? -1 : ((b.podiums > a.podiums) ? 1 : 0));
                        break;
                    }
                    case "Champion wins": {
                        pilots.sort((a,b) => (a.champion_wins > b.champion_wins) ? -1 : ((b.champion_wins > a.champion_wins) ? 1 : 0));
                        break;
                    }
                }

                return pilots;
            }
        },

        registerUser: {
            type: MessageType,
            args: {
                input: {type: new GraphQLNonNull(UserRegType)}
            },
            resolve:(source, { input }) =>{
                let message = {};
                let id = -1;

                id = Users.findIndex(visitor => visitor.email === input.email);

                if (id >= 0){
                    message.message = "User with this email already exists"
                    //return "User with this email already exists"
                } else {
                    const salt = b_crypt.genSaltSync(10);
                    const password = input.password;
                    const user = {
                        email: input.email,
                        password: b_crypt.hashSync(password, salt)
                    };

                    Users.push(user);
                    //console.log(Users);

                    //message.message ="The User was registered"
                }

                return message;
            }
        },

        loginUser: {
            type: MessageType,
            args: {
                input: {type: new GraphQLNonNull(UserRegType)}
            },
            resolve: (source, { input })=>{
                let visitor_id = -1;
                let res = {};
                visitor_id = Users.findIndex(visitor => visitor.email === input.email);

                if (visitor_id >= 0){
                    const passwordEven = b_crypt.compareSync(input.password, Users[visitor_id].password);
                    if (passwordEven){
                        const token = jwt.sign({
                            email: Users[visitor_id].email
                        }, 'SECRET_KEY', {expiresIn: 60*60});

                        //console.log(token);
                        //res.message = "Token was create";
                        res.token = token;
                    }else{
                        res.message = "Passwords don't match";
                    }
                }else{
                    res.message = "User with this email was not found";
                }

                return res;
            }
        }
    }
});

module.exports = MainMutationType;
