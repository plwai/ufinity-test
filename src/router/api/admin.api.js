const router = require('express').Router();
const adminController = require('../../controller/admin.controller');

router.post('/register', adminController.registerStudent);

module.exports = router;
