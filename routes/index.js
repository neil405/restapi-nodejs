/**
 * 1) importing another folder apis (this folder contains another apis with the version name of our API).
 * 2) an anonymous function init. We call this from the app.js file to pass all the routes of the
 * application to this and then return the next callback function.
 * 3) exporting the init function so that we can use it in other files of the application
 */

const apiRoute = require('./apis');

const init = (server) => {
    server.get('*', function (req, res, next) {
        console.log('Request was made to: ' + req.originalUrl);
        return next();
    });

    server.use('/api', apiRoute);
};

module.exports = {
    init: init
};