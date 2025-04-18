const nodemailer = require('nodemailer');

const mailSender = async (email, title, body,temp="email") => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false, 
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const info = await transporter.sendMail({
            from: 'Tube Academey || by Harshad Patil.',
            to: temp === "contact us" ? process.env.MAIL_USER : email,
            subject: title,
            html: body
        });

        // console.log('Info of sent mail - ', info);
        return info;
    }
    catch (error) {
        console.log('Error while sending mail (mailSender) - ', email);
    }
}

module.exports = mailSender;