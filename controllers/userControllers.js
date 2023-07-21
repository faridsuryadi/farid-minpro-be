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
    changeUser : async(req,res) => {
        try {
            const {currentusername,newusername} = req.body
            console.log(req.user);
            const userexist = await user.findOne(
                {
                where:{
                    id: req.user.id
                }
            }
        )
        console.log(userexist);
        const email = userexist.email
        if (currentusername !== userexist.username) throw {message:"username salah"}
        if (newusername == userexist.username) throw {message:"username harus berbeda"}

        const result = await user.update(
            {username : newusername}, {
                where:{
                    id : req.user.id
                }
            }
        )
        const data = await fs.readFileSync('./user.html', 'utf-8')
            const tempCompile  = await handlebars.compile(data)
            const tempResult = tempCompile({username : newusername})
            await transporter.sendMail({
                from:"kuga@gmail.com",
                to: email,
                subject: "Perubahan Username",
                html:tempResult
            })
        if(result[0]==0) throw {message:"gagal mengganti username"}
        res.status(200).send({message:"username berhasil diganti"})
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }

    },
    changePhone : async(req,res) => {
        try {
            const {currentphone,newphone} = req.body

            const phoneexist = await user.findOne(
                {
                where:{
                    id: req.user.id
                }
            }
        )
        if (currentphone !== phoneexist.phone) throw {message:"nomor telepon salah"}
        if (newphone == phoneexist.phone) throw {message:"nomor telepon harus berbeda"}

        const email = phoneexist.email

        const result = await user.update(
            {phone : newphone}, {
                where:{
                    id : req.user.id
                }
            }
        )
        const data = await fs.readFileSync('./phone.html', 'utf-8')
        const tempCompile  = await handlebars.compile(data)
        const tempResult = tempCompile({phone : newphone})
        await transporter.sendMail({
            from:"kuga@gmail.com",
            to: email,
            subject: "Perubahan Nomor Telepon ",
            html:tempResult
        })
        if(result[0]==0) throw {message:"gagal mengganti nomor telepon"}
        res.status(200).send({message:"nomor telepon berhasil diganti"})
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }

    },
    changeemail : async(req,res) => {
        try {
            const {currentemail,newemail} = req.body

            const emailexist = await user.findOne(
                {
                where:{
                    id: req.user.id
                }
            }
        )
        if (currentemail !== emailexist.email) throw {message:"email salah"}
        if (newemail == emailexist.email) throw {message:"email harus berbeda"}
        
        const result = await user.update(
            {email : newemail,isVerified: false},
            {
                where:{
                    id : req.user.id
                }
            }
            )

            const payload = {id: emailexist.id}
            const token = jwt.sign(payload, process.env.KEY_TOKEN, {expiresIn: '30m'})
            const newtoken = await user.update(
                {token: token}, 
                {
                    where:{
                        id : req.user.id
                    }
                }
                )
        const data = await fs.readFileSync('./surel.html', 'utf-8')
        const tempCompile  = await handlebars.compile(data)
        const tempResult = tempCompile({email:newemail,token})
        await transporter.sendMail({
            from:"kuga@gmail.com",
            to: newemail,
            subject: "Perubahan Alamat email ",
            html:tempResult
        })
        if(result[0]==0) throw {message:"gagal mengganti email"}
        res.status(200).send({message:"Silahkan verifikasi ulang",token})
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }

    },
   
    
    changePassword : async(req, res) => {
        try {
            const { currentPassword,newPassword,confirmPassword } = req.body

            const userExist = await user.findOne( 
                {where: {id : req.user.id}} 
            )

            const compare = await bcrypt.compare(currentPassword, userExist.password)
            if (!compare) {
                throw('Password Salah')
            }
            if (newPassword !== confirmPassword) {
                throw('Password tidak sama')
            }
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(newPassword,salt)

            const result = await user.update(
                {password:hashPassword},
                {where: {id: req.user.id}}
            )
            res.status(200).send({
                msg: "Success change password",
                status: true,
                result,
            })

        } catch (err) {
            console.log(err);
            res.status(400).send(err)
        }
    },
    uploadPic : async(req,res) => {
        try {
            if (req.file.size>1024*1024) throw {
                message : "file terlalu besar"
            }

            await user.update({
                imgProfile : req.file.filename}, {
                where : { 
                    id : req.user.id
                }
            
            })
            console.log(req.file);
            res.status(200).send("test")
        } catch (error) {
            res.status(400).send(error)
            console.log(error);
        }
    },
    
}