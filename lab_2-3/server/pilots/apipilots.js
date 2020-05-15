const express = require('express');
const pilotsRouter = express.Router();
const {v4} = require('uuid');

const auth = require('../middleware/auth');
let data = require('../../model/pilots_model');

let pilots = data.pilots;
let filters = data.filters;

pilotsRouter.get('/api/pilots', (req, res) =>{
    res.status(200).json(filters);
});

pilotsRouter.post('/api/pilots', auth, (req, res) =>{
    console.log(req.body);
    const pilot = {...req.body, id: v4()};
    pilots.push(pilot);
    //data.filters.push(pilot);
    res.status(201).json(pilot);
});

pilotsRouter.delete('/api/pilots/:id', auth, (req,res) => {
    pilots = pilots.filter(pilot => pilot.id !== req.params.id);
    res.status(200).json({message: 'Пилот был удален'});
});

pilotsRouter.put('/api/pilots/:id', auth, (req, res) =>{
    let id = pilots.findIndex(pilot => pilot.id === req.params.id);
    data.pilots[id] = req.body;
    res.status(200).json(pilots[id]);
});

pilotsRouter.post('/api/pilots/filter', (req,res)=> {
    let filter = {...req.body};

    if (filter.country.length !== 0)
        filters = pilots.filter(pilot => pilot.country === filter.country);
    else{
        filters = pilots;
    }

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
            filters.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            break;

        case "Name":
            console.log("Name");
            filters.sort((a,b) => (a.name> b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
            break;

        case "Podiums":
            console.log("Podiums");
            filters.sort((a,b) => (a.podiums > b.podiums) ? -1 : ((b.podiums > a.podiums) ? 1 : 0));
            break;

        case "Champion wins":
            console.log("Champion wins");
            filters.sort((a,b) => (a.champion_wins > b.champion_wins) ? -1 : ((b.champion_wins > a.champion_wins) ? 1 : 0));
            break;
    }
    res.status(200).json(filters);
});

module.exports = pilotsRouter;
