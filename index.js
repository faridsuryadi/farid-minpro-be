const express = require('express')
const PORT = 8000
const server = express()
server.use(express.json())
const db = require('./models')
const { authRouters, userRouters, blogRouters } = require('./routers')
require('dotenv').config()

server.get("/", (req,res)=>{
    res.status(200).send("Hi there, this is Express.js API")
})


server.use('/auth', authRouters)
server.use('/user', userRouters)
server.use('/blog', blogRouters)


server.listen(PORT, ()=>{
    // db.sequelize.sync({alter:true})
    console.log(`server started on PORT ${PORT}`);
})
