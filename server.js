// creating three variables and importing them from the config folder
const server = require('./configs/app')();
const config = require('./configs/config/config');
const db = require('./configs/db');

//create the basic server setup
server.create(config, db);

//start the server
server.start();