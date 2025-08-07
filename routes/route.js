const {home} = require('../controllers/mainController');


const router = require('express').Router();

router.get('/', home);




module.exports = router;