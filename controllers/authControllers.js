const db = require('../models')
const user = db.User
const {Op} = require("sequelize")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const fs = require('fs')
const handlebars = require('handlebars')
const transporter = require('../middleware/mail')


module.exports = {
    register : async(req,res) =>{
        try {
            const {username, email, phone, password, confirmpassword} = req.body

            // if(confirmpassword !== password) throw {message: "password tidak sesuai"}

            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)
            const result = await user.create({username, email, phone, password:hashPassword}, {
                attributes: { exclude: ['password'] }})

            const payload = {id: result.id}
            const token = jwt.sign(payload, process.env.KEY_TOKEN, {expiresIn: '30m'})
            
            const data = await fs.readFileSync('./regis.html', 'utf-8')
            const tempCompile  = await handlebars.compile(data)
            const tempResult = tempCompile({username, token})
            await transporter.sendMail({
                from:"kuga@gmail.com",
                to: email,
                subject: "verify account",
                html:tempResult
            })
            await user.update(
                {token:token},
                {where: {
                    id:result.id
                }}
                )
            res.status(200).send({
                status : true,
                message : 'register bershasil, silahkan verifikasi dalam 30 menit',
                token,
                result,
            })
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    verify :async(req,res)=>{
        console.log(req.user);
        try {
            const data = await user.findOne(
                {
                    where : {
                        id : req.user.id
                    }
                }
            )
            if(req.token == data.token){
            const result = await user.update(
                {isVerified : true,token : null},
                {
                where:{ 
                    id: req.user.id
                      }
                }
            )
            res.status(200).send({message : "berhasil verifikasi"})
        }
        else{ throw {message:"token salah"}}
        } catch (error) {
            console.log(error);
            res.status(400).send(error)

        }
    },

    login : async(req,res) => {
        try {
           const username = req.body.username || ""
           const phone = req.body.phone || ""
           const email = req.body.email || ""
           const password = req.body.password
            const ceklogin = await user.findOne({
                where : {
                    [Op.or]:
                    [
                        {username : username},
                        {phone : phone},
                        {email : email}
                    ]
                }
            }
        )
            if (!ceklogin) throw {message: "user tidak ada"}
            const isValid = await bcrypt.compare(password, ceklogin.password)
            if (!isValid) throw {message : "password salah"}
            if (!ceklogin.isVerified) throw {message: "akun belum terverifikasi"}
            // if ( password !== ceklogin.password ) throw {message: "password salah"}

            const payload = {id: ceklogin.id}
            const token = jwt.sign(payload, process.env.KEY_TOKEN, {expiresIn: '1d'})
            await user.update(
                {token:token},
                {where: {
                    id:ceklogin.id
                }}
                )
        res.status(200).send({
                status : true,
                message : 'berhasil login',
                token
            }
        )
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },


    keepLogin : async(req,res) => {
        try {
            const result = await user.findOne({
                where: {
                    id : req.user.id
                }
            })
            res.status(200).send(result)
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },

    forgotPassword : async(req,res)=> {
        try {
            const {email} = req.body
            const result = await user.findOne(
                {
                where:{
                    email: email
                }
            }
        )
        if (!result) throw {message: "email tidak terdaftar"}
        const payload = {id: result.id}
        const token = jwt.sign(payload, process.env.KEY_TOKEN, {expiresIn: '1h'})
        
            res.status(200).send({message:"Cek email",token})
            
            const data = await fs.readFileSync('./reset.html', 'utf-8')
            const tempCompile  = await handlebars.compile(data)
            const tempResult = tempCompile({token})
            await transporter.sendMail({
                from:"kuga@gmail.com",
                to: email,
                subject: "Reset Password",
                html:tempResult
            })
            await user.update(
                {token:token},
                {where: {
                    id:result.id
                }}
                )
        } catch (error) {
            console.log(error);
            res.status(400).send(error)

        }
    },

    resetPassword : async(req,res)=>{
            try {
                const {password, confirmpassword} = req.body
                // if(confirmpassword !== password) throw {message: "password tidak sesuai"}
                const cektoken = await user.findOne(
                    {
                        where : {
                            id : req.user.id
                        }
                    }
                )
                if(req.token == cektoken.token){
               
                const salt = await bcrypt.genSalt(10)
                const hashPassword = await bcrypt.hash(password, salt)
                const result = await user.update(
                    {password : hashPassword}, {
                        where: {
                            id : req.user.id
                        }
                    }
                    )
                    const hapustoken = await user.update(
                        {token : null},
                        {
                        where:{ 
                            id: req.user.id
                              }
                        }
                    )
                    res.status(200).send({result, message:"password berhasil diubah"})
            }
            else{throw{message:"token salah"}}
        } catch (error) {
                console.log(error);
                res.status(400).send(error)
            }
    }

}