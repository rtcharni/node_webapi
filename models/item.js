var mongoose = require('mongoose');

//Schema
var itemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    brand: {
        type: String,
    },
    qty: {
        type: Number,
    },
    unit: {
        type: String,
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});

var Item = mongoose.model('Item', itemSchema);
module.exports.itemSchema = itemSchema;
// Get Items
module.exports.getItems = (callback, limit) => {
    Item.find(callback).limit(limit);
}

// Get One Item / Or by name
module.exports.getItemById = (id, callback) => {
    Item.findById(id, callback);
}

// Add Item
module.exports.addItem = (item, callback) => {
    Item.create(item, callback);
}

