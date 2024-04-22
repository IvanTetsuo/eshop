const {Schema, model} = require('mongoose');

const schema = new Schema({
    name: {type: String, unique: true, required: true},
    items: [{type: Schema.Types.ObjectId, ref: 'Item'}],
}, {timestamps: true});

module.exports = model('Series', schema);