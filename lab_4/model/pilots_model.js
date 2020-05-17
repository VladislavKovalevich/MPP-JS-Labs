module.exports = class Pilot {
    id;
    name;
    country;
    podiums;
    champion_wins;

    constructor(id, name, country, podiums, champion_wins) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.podiums = podiums;
        this.champion_wins = champion_wins;
    }
};
