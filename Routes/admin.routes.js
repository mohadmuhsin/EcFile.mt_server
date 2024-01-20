const express = require('express')
const router = express.Router()
const adminController = require('../Controllers/admin.controller');
const { verifyToken } = require('../auth/jwt.auth');

router.get("/users", verifyToken, adminController.getUsers);
router.post('/logout', verifyToken, adminController.logout);




module.exports = router