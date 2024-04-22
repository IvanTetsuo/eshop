const {Schema, model} = require('mongoose');

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'Admin' },
    token: String,
    expires: Date,
    created: { type: Date, default: Date.now },
    revoked: Date,
    replacedByToken: String,
});

schema.virtual('isExpired').get(function () {
    return Date.now() >= this.expires;
});

schema.virtual('isActive').get(function () {
    return !this.revoked && !this.isExpired;
    // this указывает на конкретный документ. поэтому, не используем функцию стрелку
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.id;
        delete ret.user;
    }
});

module.exports = model('RefreshToken', schema);