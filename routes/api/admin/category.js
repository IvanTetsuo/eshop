const Router = require('express');
const router = new Router();
const controller = require('../../../controllers/categoryController');

router.get('/', controller.getAll);
router.post('/', controller.createCategory);

module.exports = router;