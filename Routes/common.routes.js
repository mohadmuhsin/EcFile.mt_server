const expess = require('express')
const router =  expess.Router()
const commonController =  require('../Controllers/common.controller')

router.post('/login',commonController.login);
router.post('/register',commonController.register);
router.post('/verify',commonController.verifyUser);

module.exports = router