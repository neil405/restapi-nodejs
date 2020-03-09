let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const customerCollection = new Schema({
        name: {
            type: String,
            required : [ true, 'name is required'],
        },
        pickupLat: {type: String, required: true},
        pickupLong: {type: String, required: true},
        dropOffLat: {type: String, required: true},
        dropOffLong: {type: String, required: true}
    },
    // {
    // timestamps: true
    // }
);

module.exports = mongoose.model('Customer', customerCollection);