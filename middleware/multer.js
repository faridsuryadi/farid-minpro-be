const multer = require('multer')

module.exports = {
    multerUpload: (directory ='./public',name="PIMG") => {
    
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
        cb(null, directory)
    },
    filename: (req,file,cb) => {
        console.log(file);
        cb(null,
            name + "-" + Date.now() 
            + Math.round(Math.random()*10000) 
            + "." + file.mimetype.split('/')[1]
        )
    }
})

const fileFilter = (req,file,cb) => {
    const extFilter = ['jpg','gif','png']
    const cekExt = extFilter.includes(file.mimetype.split('/')[1].toLowerCase())
    
    if(!cekExt){
        cb(new Error("hanya menerima .jpg, .gif, dan .png serta maksimum file 1mb",false))
    }
    else{
        cb(null,true)
    }
}
    return multer({storage,fileFilter , limits: {
        fileSize: 1 * 1024 * 1024,
    }})
    }}

// exports.multerUpload = multer({storage,fileFilter})