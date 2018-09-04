var mongoose = require('mongoose');
//var item = require('mongoose').model('Item').schema;
var item = require('./item').model('Item').schema;
//var itemSchema = require('mongoose').model('Item',item.schema);

//Schema
var roomSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    items:
        [item]
    ,
    create_date: {
        type: Date,
        default: Date.now
    }
});

var Room = module.exports = mongoose.model('Room', roomSchema);

// Get Rooms
module.exports.getRooms = (callback, limit) => {
    Room.find(callback).limit(limit);
}

// Add Room
module.exports.addRoom = (room, callback) => {
    Room.create(room, callback);
}