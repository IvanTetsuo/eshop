const Router = require('express');
const router = new Router();
const controller = require('../../../controllers/seriesController');

router.get('/', controller.getAll);
router.post('/', controller.createSeries);

module.exports = router;