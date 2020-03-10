let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const customerCollection = new Schema({
        date: {
            type: Date,
            required : [ true, 'date is required'],
        },
        distance: {type: String, required: false},
        fromLat: {type: String, required: true},
        fromLong: {type: String, required: true},
        fromStreetAddress: {type: String, required: false},
        onDemand: {type: String, required: true},
        patientType: {type: String, required: true},
        requestedPickupTime: {type: String, required: true},
        requestId: {type: String, required: true},
        routable: {type: String, required: true},
        timeIsByDeparture: {type: String, required: true},
        toLat: {type: String, required: true},
        toLong: {type: String, required: true},
        toStreetAddress: {type: String, required: false},
    },
    // {
    // timestamps: true
    // }
);

module.exports = mongoose.model('Customer', customerCollection);