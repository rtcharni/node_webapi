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

var User = mongoose.model('User', userSchema);
module.exports.userSchema = userSchema;

// Get User
const getUserByName = (name, callback) => {
    User.find({ name: name }, callback);
}

module.exports.getUserByName = getUserByName;

// Add User
module.exports.addUser = (user, callback) => {
    
    getUserByName(user.name, (err, foundUser) => {
        if (err) { // onko virhe jos ei löydy
            throw err;
        }
        if (foundUser.length === 0) {
            User.create(user, callback);
        } else {
            callback("User already exist")
        }
    })
}