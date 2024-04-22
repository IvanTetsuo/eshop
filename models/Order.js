const {Schema, model} = require('mongoose');

const schema = new Schema({
    items: [{type: Schema.Types.ObjectId, ref: 'Item'}],
    deliveryAddress: String, //Адрес, куда доставить
    deliveryMethod: String, //Способ доставки
    sum: Number, //Сумма в рублях
    phoneNumber: String, //Str, т.к. у номера есть скобки и дефисы
    email: String,
    customerComment: String, //Комментарий от клиента по поводу заказа
    status: {type: Number, default: 0}, //Статус заказа для админа
}, {timestamps: true});

module.exports = model('Order', schema);