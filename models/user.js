var mongoose = require('mongoose');
var room = require('./room').roomSchema;

//var item = require('./item');

//Schema User
var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rooms:
        [room]
    ,
    create_date: {
        type: Date,
        default: Date.now
    }
});

var User = module.exports = mongoose.model('User', userSchema);

// Get User
module.exports.getUserByName = (name, callback) => {
    User.find({ name: name }, callback);
}

// Add User
module.exports.addUser = (user, callback) => {
    getUserByName(user.name, (err, user) => {
        if (err) { // onko virhe jos ei löydy
            throw err;
        }
        if (user.length === 0) {
            User.create(user, callback);
        } else {
            callback("User already exist")
        }
    })
}