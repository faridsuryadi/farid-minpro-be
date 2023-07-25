const {body,validationResult} = require('express-validator')


module.exports = {
    cekRegis : async(req,res,next)=>{
        try {
            await body('username').notEmpty().withMessage("tidak boleh kosong").isAlphanumeric().withMessage("Tidak boleh ada simbol").run(req)
            await body('email').notEmpty().withMessage("tidak boleh kosong").isEmail().run(req)
            await body('phone').notEmpty().withMessage("tidak boleh kosong").isMobilePhone('id-ID').withMessage("Nomor telepon indonesia").run(req)
            await body('password').notEmpty().withMessage("tidak boleh kosong").isStrongPassword({
                minLength: 6,
                minLowercase:1,
                minUppercase:1,
                minNumbers:1,
                minSymbols:1
            }).withMessage("Password minimal 6 karakter dan harus berisikan 1 huruf besar dan kecil serta 1 simbol dan angka").run(req)
            await body("confirmpassword").notEmpty().equals(req.body.password).withMessage("password tidak sesuai").run(req)

            const validation = validationResult(req)
            if(validation.isEmpty()){
                next()
            }else{
                return res.status(400).send({
                    status : false,
                    message: "Registrasi gagal",
                    error: validation.array()
                })
            }
        } catch (error) {
            console.log(error);
        }
    }, 
    cekLogin : async(req,res,next)=>{
        try {
            await body('username').notEmpty().withMessage("tidak boleh kosong").isAlphanumeric().withMessage("Tidak boleh ada simbol").optional({
                nullable: true
            }).run(req)
            await body('email').notEmpty().withMessage("tidak boleh kosong").isEmail().optional({
                nullable: true
            }).run(req)
            await body('phone').notEmpty().withMessage("tidak boleh kosong").isMobilePhone('id-ID').withMessage("Nomor telepon indonesia").optional({
                nullable: true
            }).run(req)
            await body('password').notEmpty().withMessage("tidak boleh kosong").isStrongPassword({
                minLength: 6,
                minLowercase:1,
                minUppercase:1,
                minNumbers:1,
                minSymbols:1
            }).withMessage("Password minimal 6 karakter dan harus berisikan 1 huruf besar dan kecil serta 1 simbol dan angka").run(req)

            const validation = validationResult(req)
            if(validation.isEmpty()){
                next()
            }else{
                return res.status(400).send({
                    status : false,
                    message: "Login gagal",
                    error: validation.array()
                })
            }
        } catch (error) {
            console.log(error);
        }
    },
    cekReset : async (req, res, next) =>{
        await body('password').trim().notEmpty().isStrongPassword({
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers : 1,
          minSymbols : 1}).withMessage("Password minimal 6 karakter dan harus berisikan 1 huruf besar dan kecil serta 1 simbol dan angka").run(req);
        await body('confirmpassword').trim().notEmpty().equals(req.body.password).withMessage("password tidak sesuai").run(req);
    
        const validation = validationResult(req);
        if (validation.isEmpty()) {
          next();
        }else{
            res.status(400).send({
            status : false,
            message : 'gagal',
            error : validation.array()
          });
        }
      },
   
    
}