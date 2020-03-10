const express = require('express');
const fs = require('fs');
const csv = require('fast-csv');
const Customer = require('../../models/customer');

const getCustomers = async (req, res, next) => {
    try {

        let customers = await Customer.find({});

        if (customers.length > 0) {
            return res.status(200).json({
                'code': 200,
                'message': 'customers fetched successfully',
                'data': customers
            });
        }

        return res.status(404).json({
            'code': 'BAD_REQUEST_ERROR',
            'description': 'No customers found in the system'
        });
    } catch (error) {
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
};

const getCustomerById = async (req, res, next) => {
    try {
        let customer = await Customer.findById(req.params.id);
        if (customer) {
            return res.status(200).json({
                'message': `customer with id ${req.params.id} fetched successfully`,
                'data': customer
            });
        }

        return res.status(404).json({
            'code': 'BAD_REQUEST_ERROR',
            'description': 'No customers found in the system'
        });

    } catch (error) {

        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
};

const createCustomer = async (req, res, next) => {
    try {

        const {
            name,
            pickupLat,
            pickupLong,
            dropOffLat,
            dropOffLong
        } = req.body;

        if (name === undefined || name === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'name is required',
                'field': 'name'
            });
        }

        if (pickupLat === undefined || pickupLat === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'pickupLat is required',
                'field': 'pickupLat'
            });
        }

        if (pickupLong === undefined || pickupLong === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'pickupLong is required',
                'field': 'pickupLong'
            });
        }

        if (dropOffLat === undefined || dropOffLat === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'dropOffLat is required',
                'field': 'dropOffLat'
            });
        }

        if (dropOffLong === undefined || dropOffLong === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'dropOffLong is required',
                'field': 'dropOffLong'
            });
        }


        let isNameExists = await Customer.findOne({
            "name": name
        });

        if (isNameExists) {
            return res.status(409).json({
                'code': 'ENTITY_ALREAY_EXISTS',
                'description': 'name already exists',
                'field': 'name'
            });
        }

        const temp = {
            name: name,
            pickupLat: pickupLat,
            pickupLong: pickupLong,
            dropOffLat: dropOffLat,
            dropOffLong: dropOffLong,
        };

        let newCustomer = await Customer.create(temp);

        if (newCustomer) {
            return res.status(201).json({
                'message': 'customer created successfully',
                'data': newCustomer
            });
        } else {
            throw new Error('something went worng');
        }
    } catch (error) {
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
};

const updateCustomer = async (req, res, next) => {
    try {


        const customerId = req.params.id;

        const {
            name,
            pickupLat,
            pickupLong,
            dropOffLat,
            dropOffLong
        } = req.body;

        if (name === undefined || name === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'name is required',
                'field': 'name'
            });
        }

        if (pickupLat === undefined || pickupLat === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'pickupLat is required',
                'field': 'pickupLat'
            });
        }

        if (pickupLong === undefined || pickupLong === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'pickupLong is required',
                'field': 'pickupLong'
            });
        }

        if (dropOffLat === undefined || dropOffLat === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'dropOffLat is required',
                'field': 'dropOffLat'
            });
        }

        if (dropOffLong === undefined || dropOffLong === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'dropOffLong is required',
                'field': 'dropOffLong'
            });
        }


        let isCustomerExists = await Customer.findById(customerId);

        if (!isCustomerExists) {
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No customer found in the system'
            });
        }

        const temp = {
            name: name,
            pickupLat: pickupLat,
            pickupLong: pickupLong,
            dropOffLat: dropOffLat,
            dropOffLong: dropOffLong,
        };

        let updateCustomer = await Customer.findByIdAndUpdate(customerId, temp, {
            new: true
        });

        if (updateCustomer) {
            return res.status(200).json({
                'message': 'customer updated successfully',
                'data': updateCustomer
            });
        } else {
            throw new Error('something went wrong');
        }
    } catch (error) {

        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
};

const deleteCustomer = async (req, res, next) => {
    try {
        let customer = await Customer.findByIdAndRemove(req.params.id);
        if (customer) {
            return res.status(204).json({
                'message': `customer with id ${req.params.id} deleted successfully`
            });
        }

        return res.status(404).json({
            'code': 'BAD_REQUEST_ERROR',
            'description': 'No customers found in the system'
        });

    } catch (error) {

        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
};

const importCustomerCsvToDb = async (req, res) => {
    let records = [];
    let recordsError = [];
    let limits = 50000;
    let counter = 0;
    fs.createReadStream(req.file.path)
        .pipe(csv.parse({ headers: true}))
        .on('error', error => console.error(error))
        .on('data', data => {
            //Removes spaces from property value in-case it does have
            for (var key in data) {
                data[key] = data[key].trim();
            }
            //Create a customer Object and assign all values for it to save in database
            const customer = new Customer({
                date: data['DATE'],
                distance: data['DISTANCE'],
                fromLat: data['FROM_LAT'],
                fromLong: data['FROM_LON'],
                fromStreetAddress: data['FROM_STREET_ADDRESS'],
                onDemand: data['ON_DEMAND'],
                patientType: data['PATIENT_TYPE'],
                requestedPickupTime: data['REQUESTED_PICKUP_TIME'],
                requestId: data['REQUEST_ID'],
                routable: data['ROUTABLE'],
                timeIsByDeparture: data['TIME_IS_BY_DEPARTURE'],
                toLat: data['TO_LAT'],
                toLong: data['TO_LON'],
                toStreetAddress: data['TO_STREET_ADDRESS']
            });

            customer.validate( err => {
                counter++;
                if ( err ) {
                    // keeping track of rows from csv that fail mongoose schema validation
                    // if we want a hard stop throw error here
                    recordsError.push(counter);
                }
            });

            records.push(customer);
            // inserting records to db once hey hit the 50,000 limit
            if(records.length === limits) {
                // mongoose insertMany() used, with ordered set to false will allow
                // rows from csv that did not fail validation to be inserted to database
                Customer.insertMany(records, {ordered: false});
                records = [];
            }
        })
        .on("error", function (error) {
            console.log("There is an error in processing: " + error);
            throw new Error('something went wrong' + error);
        })
        .on('end', rowCount => {
            // if any records left insert them before returning http status
            if(records.length) {
                // mongoose insertMany() used, with ordered set to false will allow
                // rows from csv that did not fail validation to be inserted to database
                Customer.insertMany(records, {ordered: false});
                records = [];
            }
            if(recordsError.length) {
                return res.status(200).json({
                    'code' : 200,
                    'message': 'Some rows from the csv were not uploaded successfully. Please review rows: ' + recordsError
                });
            } else {
                return res.status(200).json({
                    'code' : 200,
                    'message': 'CSV uploaded to database successfully'
                });
            }
        });
};

module.exports = {
    getCustomers: getCustomers,
    getCustomerById: getCustomerById,
    createCustomer: createCustomer,
    updateCustomer: updateCustomer,
    deleteCustomer: deleteCustomer,
    importCustomerCsvToDb: importCustomerCsvToDb
};