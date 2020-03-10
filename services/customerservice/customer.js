const express = require('express');
const Customer = require('../../models/customer');

const getCustomers = async (req, res, next) => {
    try {

        let customers = await Customer.find({});

        if (customers.length > 0) {
            return res.status(200).json({
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

const fs = require('fs');
const streamToIterator = require('stream-to-iterator');
const csv = require('fast-csv');

const importCustomerCsvToDb = async (req, res) => {
    // try {
    //     let headers = Object.keys(Customer.schema.paths)
    //         .filter(k => ['_id','__v'].indexOf(k) === -1);
    //
    //     console.log(headers);
    //
    //     let stream = fs.createReadStream(__dirname + '/' + 'customerfile.csv')
    //         .pipe(csv.parse({headers: headers}));
    //
    //
    //     const iterator = await streamToIterator(stream).init();
    //
    //     let buffer = [],
    //         counter = 0;
    //
    //     for ( let docPromise of iterator ) {
    //         let doc = await docPromise;
    //         buffer.push(doc);
    //         counter++;
    //
    //         if ( counter > 50000 ) {
    //             await Customer.insertMany(buffer);
    //             buffer = [];
    //             counter = 0;
    //         }
    //     }
    //
    //     if ( counter > 0 ) {
    //         await Customer.insertMany(buffer);
    //         buffer = [];
    //         counter = 0;
    //     }
    //
    //     return res.status(200).json({
    //         'message': 'customer updated successfully',
    //     })
    //
    // } catch(e) {
    //     console.error(e)
    // } finally {
    //     process.exit()
    // }

    let records = [];
    let limits = 50000;
    fs.createReadStream(req.file.path)
        .pipe(csv.parse({ headers: true}))
        .on('error', error => console.error(error))
        .on('data', data => {
            // customize your data here
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
            records.push(customer);
            if(records.length==limits) {
                Customer.insertMany(records);
                records = [];
            }
        })
        .on("error", function (error) {
            console.log("There is an error in processing: " + error);
            throw new Error('something went wrong' + error);
        })
        .on('end', rowCount => {
            if(records.length) {
                Customer.insertMany(records);
                records = [];
            }
            console.log("done");
            return res.status(200).json({
                'code' : 200,
                'message': 'customer updated successfully'
            });
        });

    // csv
    //     .parseFile(__dirname + '/' + 'customerfile.csv', {headers: true})
    //     .on("data", data => {
    //         console.log(data);
    //         //Removes spaces from property value in-case it does have
    //         for (var key in data) {
    //             data[key] = data[key].trim();
    //         }
    //         //Create a customer Object and assign all values for it to save in database
    //         const customer = new Customer({
    //             date: data['DATE'],
    //             distance: data['DISTANCE'],
    //             fromLat: data['FROM_LAT'],
    //             fromLong: data['FROM_LON'],
    //             fromStreetAddress: data['FROM_STREET_ADDRESS'],
    //             onDemand: data['ON_DEMAND'],
    //             patientType: data['PATIENT_TYPE'],
    //             requestedPickupTime: data['REQUESTED_PICKUP_TIME'],
    //             requestId: data['REQUEST_ID'],
    //             routable: data['ROUTABLE'],
    //             timeIsByDeparture: data['TIME_IS_BY_DEPARTURE'],
    //             toLat: data['TO_LAT'],
    //             toLong: data['TO_LON'],
    //             toStreetAddress: data['TO_STREET_ADDRESS']
    //         });
    //         //save in database
    //         customer.save(function (err) {
    //             if (err) {
    //                 console.log("There is an error in processing customer data: " + err);
    //                 throw boom.boomify(err);
    //             } else {
    //                 console.log("Customer data has been saved: " + data);
    //             }
    //         })
    //     })
    //     .on("error", function (error) {
    //         console.log("There is an error in processing: " + error);
    //         throw new Error('something went wrong' + error);
    //     })
    //     .on("end", function () {
    //         console.log("done");
    //     });
    //
    // return res.status(200).json({
    //     'message': 'customer updated successfully',
    //     'data': updateCustomer
    // });
};

module.exports = {
    getCustomers: getCustomers,
    getCustomerById: getCustomerById,
    createCustomer: createCustomer,
    updateCustomer: updateCustomer,
    deleteCustomer: deleteCustomer,
    importCustomerCsvToDb: importCustomerCsvToDb
};