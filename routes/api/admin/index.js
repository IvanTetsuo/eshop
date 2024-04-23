const Router = require('express');
const router = new Router();
const authRouter = require('./auth');
const itemRouter = require('./item');
const categoryRouter = require('./category');
const seriesRouter = require('./series');

router.use('/auth', authRouter);
router.use('/item', itemRouter);
router.use('/category', categoryRouter);
router.use('/series', seriesRouter);

module.exports = router;