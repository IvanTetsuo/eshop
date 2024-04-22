const {Schema, model} = require('mongoose');

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'Admin' },
    token: String,
    expires: Date,
    revoked: Date,
}, {timestamps: true});

schema.virtual('isExpired').get(function () {
    return Date.now() >= this.expires;
});

schema.virtual('isActive').get(function () {
    return !this.revoked && !this.isExpired;
});

module.exports = model('RestoreToken', schema);