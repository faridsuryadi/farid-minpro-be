const jwt = require('jsonwebtoken')

module.exports = {
    verifyToken: (req,res,next)=>{
        try {
            let token = req.headers.authorization
            if (!token) throw {message : "tidak ada token"}
            token = token.split(' ')[1]
            req.token = token
            
            let verifiedUser = jwt.verify(token, process.env.KEY_TOKEN)
            req.user = verifiedUser
            // console.log(token);
            // console.log(verifiedUser);
            next()
        } catch (error) {
            res.status(400).send(error)
        }
    },
 
}