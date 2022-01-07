const nodeMailer = require("nodemailer");

const sendEmail = function (options)
{
    const transporter = nodeMailer.createTransport({
        service: "Gmail",
        auth:
            {
                user: process.env.NODEMAILER_GMAIL_USER,
                password: process.env.NODEMAILER_GMAIL_PASSWORD
            }
    })
}