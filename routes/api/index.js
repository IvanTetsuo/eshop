const Router = require('express');
const router = new Router();
const adminRouter = require('./admin');

router.post('/', async function(req, res) {
    res.json(req.body);
});

router.get('/', async function(req, res) {
    res.json(req.body);
});

router.use('/admin', adminRouter);

module.exports = router;