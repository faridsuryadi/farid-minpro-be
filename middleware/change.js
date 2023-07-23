const {body,validationResult} = require('express-validator')


module.exports = {
    cekUser : async(req,res,next)=>{
        try {
            await body('currentusername').notEmpty().withMessage("tidak boleh kosong").isAlphanumeric().withMessage("Tidak boleh ada simbol").run(req)
            await body('newusername').notEmpty().withMessage("tidak boleh kosong").isAlphanumeric().withMessage("Tidak boleh ada simbol").run(req)
            
            const validation = validationResult(req)
            if(validation.isEmpty()){
                next()
            }else{
                return res.status(400).send({
                    status : false,
                    message: "Gagal mengganti username",
                    error: validation.array()
                })
            }
        } catch (error) {
            console.log(error);
        }
    },
    cekPhone : async (req, res, next) =>{
      await body('currentphone').notEmpty().withMessage("tidak boleh kosong").isMobilePhone('id-ID').withMessage("Nomor telepon indonesia").run(req)
      await body('newphone').notEmpty().withMessage("tidak boleh kosong").isMobilePhone('id-ID').withMessage("Nomor telepon indonesia").run(req)
      const validation = validationResult(req);
        
      if (validation.isEmpty()) {
        next();
      }else{
          res.status(400).send({
          status : false,
          message : 'gagal mengganti nomor telepon',
          error : validation.array()
        });
      }
    },
    cekEmail: async (req, res, next) =>{
      await body('currentemail').notEmpty().withMessage("tidak boleh kosong").isEmail("Format Email salah").run(req)
      await body('newemail').notEmpty().withMessage("tidak boleh kosong").isEmail("Format Email salah").run(req)
      const validation = validationResult(req);
        
      if (validation.isEmpty()) {
        next();
      }else{
          res.status(400).send({
          status : false,
          message : 'gagal mengganti email',
          error : validation.array()
        });
      }
    },
    cekPass: async (req, res, next) => {
        try {
          await body('currentPassword').trim().notEmpty().run(req);
          await body('newPassword').trim().notEmpty().run(req);
          await body('confirmPassword').trim().notEmpty().equals(req.body.newPassword).withMessage("password tidak cocok").run(req);
          const validation = validationResult(req);
          
          if (validation.isEmpty()) {
            next();
          }else{
              res.status(400).send({
              status : false,
              message : 'gagal mengganti password',
              error : validation.array()
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
}