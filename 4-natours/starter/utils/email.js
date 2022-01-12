const nodeMailer = require("nodemailer");

const sendEmail = async function (options) {
    // const transporter = nodeMailer.createTransport({
    //     service: "Gmail",
    //     auth:
    //         {
    //             user:
    //             password:
    //         }
    // })
    const transporter = nodeMailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: "Adrian Zaplata <hello@adrian.pl>",
        to: options.email,
        subject: options.subject,
        text: options.message,

    }

    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;