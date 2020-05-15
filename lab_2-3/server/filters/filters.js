const express = require('express');
const filterRouter = express.Router();

let pilots = require('../pilots/apipilots');

filterRouter.post('/api/pilots/sort', (req, res)=>{

});

module.exports = filterRouter;

