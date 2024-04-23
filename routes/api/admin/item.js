const Router = require('express');
const router = new Router();
const controller = require('../../../controllers/itemController');

router.get('/', controller.getAll);
router.post('/', controller.createItem);

module.exports = router;