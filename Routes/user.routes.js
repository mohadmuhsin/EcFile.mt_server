const expess = require('express')
const router =  expess.Router()
const userController =  require('../Controllers/user.controller');
const { verifyToken } = require('../auth/jwt.auth');



router.post("/logout",verifyToken, userController.logout)


module.exports = router