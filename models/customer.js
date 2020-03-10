let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const customerCollection = new Schema({
        date: {
            type: Date,
            required : [ true, 'date is required']
        },
        distance: {type: String, required: false},
        fromLat: {type: String, required: [ true, 'from latitude is required']},
        fromLong: {type: String, required: [ true, 'from longitude is required']},
        fromStreetAddress: {type: String, required: false},
        onDemand: {type: String, required: [ true, 'on demand is required']},
        patientType: {type: String, required: [ true, 'patient type is required']},
        requestedPickupTime: {type: String, required: [ true, 'request pickup time is required']},
        requestId: {type: String, required: [ true, 'request id is required']},
        routable: {type: String, required: [ true, 'routable is required']},
        timeIsByDeparture: {type: String, required: [ true, 'time is by departure is required']},
        toLat: {type: String, required: [ true, 'to latitude is required']},
        toLong: {type: String, required: [ true, 'to longitude is required']},
        toStreetAddress: {type: String, required: false},
    },
    // {
    // timestamps: true
    // }
);

module.exports = mongoose.model('Customer', customerCollection);