const router = require('express').Router();
const adminController = require('../../controller/admin.controller');

router.post('/register', adminController.registerStudent);

router.get('/commonstudents', adminController.getCommonStudent);

router.post('/suspend', adminController.suspendsStudent);

module.exports = router;
