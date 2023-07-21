

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
              message : 'Validation Invalid',
              error : validation.array()
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
}