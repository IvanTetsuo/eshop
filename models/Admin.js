const {Schema, model} = require('mongoose');
const Admin = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    firstName: {type: String, default: ''},
    lastName: {type: String, default: ''},
    email: {type: String, unique: true, required: true},
});

Admin.set('toJSON', {
    versionKey: false,
    virtuals: true,
    transform: function (doc, ret) {
        delete ret.password;
    }
});

Admin.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

module.exports = model('Admin', Admin);