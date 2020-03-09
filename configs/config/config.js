//we are requiring the env file which is dependent on the environment
// like local, testing, staging or production
// we are only creating a local file which you can modify later to setup other environments.

const _ = require('lodash');
const env = process.env.NODE_ENV || 'local';
const envConfig = require('./' + env);
let defaultConfig = {
    env: env
};
module.exports = _.merge(defaultConfig, envConfig);