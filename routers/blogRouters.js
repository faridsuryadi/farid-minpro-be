const {blogControllers} = require('../controllers')
const { verifyToken } = require('../middleware/auth')
const { multerUpload } = require('../middleware/multer')
const router = require('express').Router()

router.get("/",blogControllers.getAll)
router.get("/getlike",verifyToken,blogControllers.getLike)
router.post("/like",verifyToken,blogControllers.likeBlog)
router.get("/user",verifyToken,blogControllers.userBlog)
router.post("/create",verifyToken,multerUpload('./public/blog','Blog').single('file'),blogControllers.createBlog)

module.exports = router