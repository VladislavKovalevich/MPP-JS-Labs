const { GraphQLList, GraphQLObjectType } = require('graphql');

const { PilotType, UserType } = require('./types.js');
let Pilots = require('../../data/pilots');
let Users = require('../../data/users');

const MainQueryType = new GraphQLObjectType({
    name: 'MainQueryType',
    description: 'Query Schema for MainType',
    fields: {
        pilots: {
            type: new GraphQLList(PilotType),
            resolve: () => Pilots
        },
        users: {
            type: new GraphQLList(UserType),
            resolve: () => Users
        }
    }
});

module.exports = MainQueryType;
