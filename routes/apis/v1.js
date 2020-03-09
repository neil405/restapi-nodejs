// this file we are importing the controllers which send our request to the
// appropriate function and return data

const customerController = require('../../controllers/apis/customer');

const express = require('express');
let router = express.Router();
router.use('/customers', customerController);
module.exports = router;