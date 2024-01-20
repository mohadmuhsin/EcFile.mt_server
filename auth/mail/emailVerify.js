const nodemailer = require("nodemailer");

const { verifyEmail } = require("../../public/templates/emailVerify");
require("dotenv").config();
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GOOGLEUSER,
        pass: process.env.GOOGLEPASS,
    },
});

async function sendVerifyEmailAsLink(to, mobile, url) {
    try {
        const mailOptions = {
            from: "EcFile",
            to,
            subject: "Email verification",
            html: verifyEmail(mobile, url),
            replyTo: "muhsinmfz@gmail.com",
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
        return { status: true, verif_id: mobile };
    } catch (error) {
        console.error("Error sending email:", error);
        return { status: false, verif_id: null };
    }
}



module.exports = {
    sendVerifyEmailAsLink,
};
