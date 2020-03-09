const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

module.exports = function () {

    /**
     * In the server variable, we are assigning the express object.
     * The create and start variable has a function which we are using in our server.js file.
     * The create function configure all the setup for this application and while start
     * function will start our application.
     */

    let server = express(),
        create,
        start;

    // In the create function, we are using the config variable pulled from the config.js file
    create = (config, db) => {
        let routes = require('../routes');
        // set all the server things
        server.set('env', config.env);
        server.set('port', config.port);
        server.set('hostname', config.hostname);

        // add middleware to parse the json
        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({
            extended: false
        }));

        //connect the database
        mongoose.connect(
            db.database,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            })
            .then(() => console.log('MongoDB Connected'))
            .catch(err => console.log(err));

        // Set up routes
        routes.init(server);
    };


    start = () => {
        let hostname = server.get('hostname'),
            port = server.get('port');
        server.listen(port, function () {
            console.log('Express server listening on - http://' + hostname + ':' + port);
        });
    };
    return {
        create: create,
        start: start
    };
};