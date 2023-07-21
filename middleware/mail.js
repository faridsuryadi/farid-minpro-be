const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user : process.env.MAIL_TRANSPORT,
        pass : process.env.PASS_TRANSPORT
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = transporter