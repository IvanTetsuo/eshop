const {Schema, model} = require('mongoose');

const schema = new Schema({
    name: {type: String, unique: true, required: true},
    category: {type: Schema.Types.ObjectId, required: true, ref: 'Category'},
    price: Number,
    series: {type: Schema.Types.ObjectId, ref: 'Series'},
    stock: Number, //остаток товаров на складе
    discount: Number, //скидка
    description: String,
    images: [String],
    size: String, //размер объекта для человека
}, {timestamps: true});

module.exports = model('Item', schema);