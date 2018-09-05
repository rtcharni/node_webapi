var mongoose = require('mongoose');
var item = require('./item').itemSchema;
// var item = require('mongoose').model('Item', itemSchema).schema;
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

var Room = mongoose.model('Room', roomSchema);
module.exports.roomSchema = roomSchema;

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
module.exports.addItemToRoom = (roomName, item, options, callback) => {
    Room.findOneAndUpdate({name: roomName}, {$push: {items:item}}, (err, room) => {
        if (err) {
            throw err;
        }
    });
    //Pitääkö tehdä se uusi item (new) tai add myös items schemaan??
    // existingRoom.items.push(item);
    // let tempItems = [...existingRoom.items];
    // tempItems.push(item);
    // Room.findOneAndUpdate({name: roomName}, tempItems, options, callback);

}
