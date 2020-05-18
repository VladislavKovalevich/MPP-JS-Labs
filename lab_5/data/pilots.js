const {v4} = require('uuid');

const Pilots = [
    {
        id: v4(),
        name: "Nico Rosberg",
        country: "Germany",
        podiums: 34,
        champion_wins: 1
    },
    {
        id: v4(),
        name: "Sebastian Vettel",
        country: "Germany",
        podiums: 42,
        champion_wins: 4
    },
    {
        id: v4(),
        name: "Nigel Mansell",
        country: "England",
        podiums: 54,
        champion_wins: 1
    },
    {
        id: v4(),
        name: "Damon Hill",
        country: "England",
        podiums: 45,
        champion_wins: 1
    }
];

module.exports = Pilots;
