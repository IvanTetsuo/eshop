const Series = require('../models/Series');

class SeriesController {
    async getAll(req, res) {
        try {
            const series = await Series.find().populate('items');
            res.json(series);
        } catch(err) {
            res.status(400).json({message: 'woops'});
        }
    }

    async createSeries(req, res) {
        try {
            const {name} = req.body;
            const series = new Series({name});
            await series.save();
            res.json(series);
        } catch(err) {
            res.status(400).json({message: 'woops'});
        }
    }
}

module.exports = new SeriesController();