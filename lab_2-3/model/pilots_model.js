const {v4} = require('uuid');

class Pilot {
    constructor(id, name, country, podiums, champion_wins) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.podiums = podiums;
        this.champion_wins = champion_wins;
    }
}

let pilots = [];

pilots.push(new Pilot(v4(), "Nico Rosberg", "Germany", 45, 1));
pilots.push(new Pilot(v4(), "Lewis Hamilton", "England", 65, 6));
pilots.push(new Pilot(v4(), "Daniil Kvyat", "Russia", 3, 0));
pilots.push(new Pilot(v4(), "Carlos Sainz", "Spain", 1, 0));

module.exports = {pilots: pilots, filters: pilots};