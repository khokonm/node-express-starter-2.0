const event = require("../services/event.service");
const mailer = require("../utils/mailer.util");

event.on("SEND_MAIL", async (payload) => {
    try {
        const { email, authToken } = payload;
        console.log(email, authToken)
        // send the OTP token 
        await mailer.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: `${authToken} is your verification code`,
            html: `
            HTML Supported Verification Code Email. <br />
            Your verification code is: ${authToken}
            `
        });
    } catch (err) {
        console.log(err);
        console.log("Error sending email");
    }
});