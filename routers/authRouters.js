const {authControllers} = require('../controllers')
const { verifyToken } = require('../middleware/auth')
const { cekRegis, cekLogin, cekReset } = require('../middleware/validator')
const router = require('express').Router()

router.post('/',cekRegis, authControllers.register)
router.post('/login',cekLogin, authControllers.login)
router.get('/keep',verifyToken, authControllers.keepLogin)
router.patch('/verify',verifyToken, authControllers.verify)
router.post('/forgot', authControllers.forgotPassword)
router.patch('/reset',verifyToken,cekReset, authControllers.resetPassword)

module.exports = router