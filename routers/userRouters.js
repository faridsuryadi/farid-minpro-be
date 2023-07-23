const { userControllers } = require('../controllers')
const { verifyToken } = require('../middleware/auth')
const { multerUpload } = require('../middleware/multer')
const { cekUser, cekPhone, cekEmail, cekPass } = require('../middleware/change')
const router = require('express').Router()


router.patch("/changeuser",verifyToken,cekUser,userControllers.changeUser)
router.patch("/changephone",verifyToken,cekPhone,userControllers.changePhone)
router.patch("/changeemail",verifyToken,cekEmail,userControllers.changeemail)
router.patch("/changepass",verifyToken,cekPass,userControllers.changePassword)
router.post('/upload',verifyToken,multerUpload('./public/profile','Avatar').single('file'),userControllers.uploadPic)

module.exports = router