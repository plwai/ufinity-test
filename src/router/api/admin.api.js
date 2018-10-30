const router = require('express').Router();
const adminController = require('../../controller/admin.controller');

router.post('/register', adminController.registerStudent);

router.get('/commonstudents', adminController.getCommonStudent);

router.post('/suspend', adminController.suspendsStudent);

router.post('/retrievefornotifications', adminController.receiveNotification);

module.exports = router;
