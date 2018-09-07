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
module.exports.User = User;
module.exports.userSchema = userSchema;

// Get User
const getUserByName = (name, callback) => {
    User.find({ name: name }, callback);
}
module.exports.getUserByName = getUserByName;

// Add user to Room NOT IN USE
// module.exports.addUserToRoom = (user, room, callback) => {
//     const newRoom =
//         User.findOneAndUpdate({ name: user.name }, { $push: { rooms: room } }, (err, docs) => {

//         })

//     User.find({ name: user.name }, (err, docs) => {
//         if (err) {
//             callback(err);
//         } else {

//         }
//     })
// }

// Add User
module.exports.addUser = (user, callback) => {
    getUserByName(user.name, (err, foundUser) => {
        if (err) { // onko virhe jos ei löydy
            callback(err)
        }
        if (foundUser.length === 0) {
            User.create(user, callback);
        } else {
            callback({ error: "User already exist" })
        }
    })
}

//Get one user LOCALS
module.exports.getUserMiddleware = (req, res, next) => {
    User.find({ name: req.params.username }, (err, docs) => {
        if (err) {
            console.log(err);
            //handleResponse(err)
        } else if (!docs.length) {
            //res 204 empty
        } else {
            res.locals.user = docs[0];
            next();
        }
    })
    // get user from db
    // when done, add user to res.locals
    // call next
}

//Add room to User from LOCALS
module.exports.addRoomtoUserMiddleware = (req, res, next) => {
    let temp = res.locals.user.rooms.filter(x => x.name == res.locals.room.name);
    if (temp.length == 0) {
        res.locals.user.rooms.push(res.locals.room);
        res.locals.user.save((err, callback) => {
            if (err) {
                res.json(err);
            }
        });
    } else {
        res.send({User_Already_Is_In_Room: res.locals.room.name})
    }
    // save room to user (to db)
    // when done, call next()
}