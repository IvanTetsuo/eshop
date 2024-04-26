const Router = require('express');
const router = new Router();
const controller = require('../../../controllers/itemController');

router.get('/', controller.getAll);
router.post('/', controller.createItem);
router.get('/:itemId', controller.getItem);
router.delete('/:itemId', controller.deleteItem);
router.post('/:itemId', controller.updateItem);

module.exports = router;