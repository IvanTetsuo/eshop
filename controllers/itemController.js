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
    
    async getItem(req, res) {
        try {
            const itemId = req.params.itemId;
            if (!itemId) {
                return res.status(400).json({message: 'woops'});
            }
            const item = await Item.findById(itemId);
            res.json(item);
        } catch(err) {
            res.status(400).json({message: 'woops'});
        }
    }

    async deleteItem(req, res) {
        try {
            const itemId = req.params.itemId;
            if (!itemId) {
                return res.status(400).json({message: 'woops'});
            }
            const item = await Item.findById(itemId);
            if (!item) {
                return res.status(404).json({message: 'not found'});
            }
            // удалена 57-я строка из референса
            await Item.deleteOne({_id: item._id});
            res.json({message: 'item удалён'});
        } catch(err) {
            res.status(400).json({message: 'woops'});
        }
    }

    async updateItem(req, res) {
        try {
            const itemId = req.params.itemId;
            if (!itemId) {
                return res.status(400).json({message: 'woops'});
            }
            const item = await Item.findById(itemId);
            if (!item) {
                return res.status(404).json({message: 'not found'});
            }
            //78-я удалена
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
            // if (!title && !text) {
            //     return res.status(400).json({message: 'статья не найдена'});
            // }
            if (name) {
                item.name = name;
            }
            if (category) {
                item.category = category;
            }
            if (price) {
                item.price = price;
            }
            if (series) {
                item.series = series;
            }
            if (stock) {
                item.stock = stock;
            }
            if (discount) {
                item.discount = discount;
            }
            if (description) {
                item.description = description;
            }
            if (images) {
                item.images = images;
            }
            if (size) {
                item.size = size;
            }
            await item.save();
            res.json({updatedItem: item});
        } catch(err) {
            console.log(err);
            res.status(400).json({message: 'woops'});
        }
    }
}

module.exports = new ItemController();