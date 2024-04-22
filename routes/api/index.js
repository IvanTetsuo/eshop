const Router = require('express');
const router = new Router();

router.post('/', async function(req, res) {
    res.json(req.body);
});

router.get('/', async function(req, res) {
    res.json(req.body);
});

module.exports = router;