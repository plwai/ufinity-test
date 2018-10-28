const router = require('express').Router();
const adminController = require('../../controller/admin.controller');

router.get('/register', adminController.registerStudent);

module.exports = router;
