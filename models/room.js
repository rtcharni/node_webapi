var mongoose = require('mongoose');
var item = require('./item');

//Schema
var roomSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
    // items:
    //     [item],
    // create_date: {
    //     type: Date,
    //     default: Date.now
    // }
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