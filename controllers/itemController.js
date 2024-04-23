const Item = require('../models/Item');
const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Series = require('../models/Series');

class ItemController {
    async getAll(req, res) {
        try {
            const items = await Item.find().populate('category').populate('series');
            res.json(items);
        } catch(err) {
            res.status(400).json({message: 'woops'});
        }
    }

    async createItem(req, res) {
        try {
            const {
                name,
                category,
                price,
                series,
                stock, //остаток товаров на складе
                discount, //скидка
                description,
                images,
                size,
            } = req.body;
            const item = new Item({
                name,
                category,
                price,
                series,
                stock, //остаток товаров на складе
                discount, //скидка
                description,
                images,
                size,
            });
            await item.save();
            const categoryDoc = await Category.findById(category);
            categoryDoc.items.push(item);
            await categoryDoc.save();
            if (series) {
                const seriesDoc = await Series.findById(series);
                seriesDoc.items.push(item);
                await seriesDoc.save();
            }
            res.json(item);
        } catch(err) {
            console.log(err);
            res.status(400).json({message: 'woops'});
        }
    }
    
}

module.exports = new ItemController();