var mongoose = require('mongoose');
//var item = require('mongoose').model('Item').schema;
var item = require('./item').Item
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

var Room = module.exports.Room = mongoose.model('Room', roomSchema);

// Get Rooms
module.exports.getRooms = (callback, limit) => {
    Room.find(callback).limit(limit);
}

//Get One Room
module.exports.getRoomByName = (name, callback) => {
    Room.find({name: name}, callback);
}

// Add Room
module.exports.addRoom = (room, callback) => {
    Room.create(room, callback);
}

//Update Item to Room, Tarviiko?? Vai addItem ja assign to Room??
module.exports.updateRoom = (roomName, item, options, callback) => {
    var existingRoom = Room.find({name: roomName},(err, room) => {
        if (err) {
            throw err;
        }
        return room;
    });
    //Pitääkö tehdä se uusi item (new) tai add myös items schemaan??
    existingRoom.items.add(item);
    Room.findOneAndUpdate({name: roomName}, existingRoom, options, callback)

}
