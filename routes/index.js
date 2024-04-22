const Router = require('express');
const router = new Router();
const apiRouter = require('./api');
const path = require('path');

router.use('/api/', apiRouter);

router.use('/api/a/', apiRouter);
router.get('/', function (req, res) {
    res.render('index', {a:5});
});

module.exports = router;