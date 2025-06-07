const nodemailer = require('nodemailer');

const sendEmail = async ({ email, subject, text, html }) => {
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

const sendVerificationEmail = async ({ email, url }) => {
    await sendEmail({
        email: email,
        subject: 'Verify Your Email',
        text: `Click the link to verify your email address.`,
        html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Verify Email</title>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 40px 0;">
                        <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff; border-radius: 6px; box-shadow: 0 0 6px rgba(0,0,0,0.1); font-family: Arial, sans-serif; padding: 40px;">
                            <tr>
                                <td align="center" style="padding-bottom: 20px; font-weight:900; font-size:32px">
                                    IEEE MESH
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="font-size: 16px; color: gray;">
                                Please confirm that you want to use this as your account email address. Once verified, you can setup your profile and start connecting!
                                </td>
                            </tr>
                           <tr>
                                <td align="center" style="padding: 20px 0;">
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;">
                                    <tr>
                                        <td align="center">
                                        <a href="${url}"
                                            style="display: inline-block; background-color: #000000; color: #ffffff; padding: 14px 0; width: 100%; font-size: 16px; font-weight: bold; text-align: center; text-decoration: none; border-radius: 6px; font-family: Arial, sans-serif;">
                                            Verify my email
                                        </a>
                                        </td>
                                    </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="font-size: 14px; color: #888;">
                                Or paste this link into your browser:<br>
                                <b>
                                    <a href="{url}"
                                        style="color: #66B3F9; word-break: break-all; text-decoration:none">
                                        ${url}
                                    </a>
                                </b>
                                </td>
                            </tr>
                            </table>
                        </td>
                        </tr>
                        <tr>
                            <td align="center" style="font-size: 12px; color: gray; padding-top: 20px; font-family: Arial, sans-serif">
                                &copy; 2025 IEEE MESH. All rights reserved.<br>
                               Gainesville, FL 32612
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding-top: 10px;">
                                <img src="https://iconduck.com/api/v2/vectors/vctr640ufs5o/media/png/256/download" alt="Footer Icon" width="48">
                                </td>
                            </tr>
                    </table>
                </body>
                </html>
            `
    });
};

module.exports = { sendEmail, sendVerificationEmail };