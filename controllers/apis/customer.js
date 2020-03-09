const express = require('express');
const customerService = require('../../services/customerservice/customer');
let router = express.Router();

router.get('/getCustomers', customerService.getCustomers);

router.get('/getCustomerById/:id', customerService.getCustomerById);

router.post('/createCustomer', customerService.createCustomer);

router.put('/editCustomer/:id', customerService.updateCustomer);

router.delete('/deleteCustomer/:id', customerService.deleteCustomer);

router.post('/importCustomersCsv', customerService.importCustomerCsvToDb);

module.exports = router;