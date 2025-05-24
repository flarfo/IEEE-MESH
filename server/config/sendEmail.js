const nodemailer = require('nodemailer');

const sendEmail = async ({email, subject, text, html}) => {
    try {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        await transport.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: subject,
            text: text,
            html: html
        });
    }
    catch (err) {
        console.log(err);
    }
};

module.exports = sendEmail;