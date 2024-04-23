const Category = require('../models/Category');

class CategoryController {
    async getAll(req, res) {
        try {
            const categories = await Category.find().populate('items');
            res.json(categories);
        } catch(err) {
            res.status(400).json({message: 'woops'});
        }
    }

    async createCategory(req, res) {
        try {
            const {name} = req.body;
            const category = new Category({name});
            await category.save();
            res.json(category);
        } catch(err) {
            res.status(400).json({message: 'woops'});
        }
    }
}

module.exports = new CategoryController();