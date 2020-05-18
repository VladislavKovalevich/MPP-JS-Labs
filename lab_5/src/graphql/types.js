const {
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInputObjectType
} = require('graphql');

const MessageType = new GraphQLObjectType({
    name: 'MessageType',
    description: 'Return messages',
    fields: {
        message: { type: GraphQLString },
        token: { type: GraphQLString }
    }
});

const UserType = new GraphQLObjectType({
    name: 'UserType',
    description: 'User list',
    fields: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
    }
});

const UserRegType = new GraphQLInputObjectType({
    name: 'UseAddType',
    description: 'User add to list',
    fields: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
    }
});

const UserLogType = new GraphQLInputObjectType({
    name: 'UseAddType',
    description: 'User add to list',
    fields: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
    }
});

const PilotType = new GraphQLObjectType({
    name: 'PilotType',
    description: 'Pilot list',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        country: { type: GraphQLString },
        podiums: { type: GraphQLInt },
        champion_wins: {type: GraphQLInt }
    }
});

const PilotCreateType = new GraphQLInputObjectType({
   name: 'PilotCreateType',
   description: 'Add pilot to the list',
   type: PilotType,
   fields: {
       name: { type: new GraphQLNonNull(GraphQLString) },
       country: { type: new GraphQLNonNull(GraphQLString) },
       podiums: { type: new GraphQLNonNull(GraphQLInt) },
       champion_wins: { type: GraphQLNonNull(GraphQLInt) }
   }
});

const PilotDeleteType = new GraphQLInputObjectType({
    name: 'PilotDeleteType',
    description: 'Delete pilot from the list',
    type: PilotType,
    fields: {
        id: { type: new GraphQLNonNull(GraphQLString) }
    }
});

const PilotUpdateType = new GraphQLInputObjectType({
    name: 'PilotUpdateType',
    description: 'Update pilot from the list',
    type: PilotType,
    fields: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        country: { type: new GraphQLNonNull(GraphQLString) },
        podiums: { type: new GraphQLNonNull(GraphQLInt) },
        champion_wins: {type: new GraphQLNonNull(GraphQLInt) }
    }
});

const PilotSortType = new GraphQLInputObjectType({
    name: 'PilotSortType',
    description: 'Sort pilot from the list',
    type: PilotType,
    fields: {
        sortParam: { type: new GraphQLNonNull(GraphQLString) },
        countryFilter: {type: new GraphQLNonNull(GraphQLString) },
        firstValue: { type: new GraphQLNonNull(GraphQLInt) },
        secondValue: { type: new GraphQLNonNull(GraphQLInt) }
    }
});

module.exports = { PilotType, PilotCreateType, PilotDeleteType, PilotUpdateType, PilotSortType, UserType, UserRegType, UserLogType, MessageType };
