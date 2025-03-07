const db = require("../services/db.service");
const generateToken = require("./generateToken.util");

const authorize = async (req, res, email, authOn = "client") => {
    try {
        console.log('on authorize');
        const User = await db.user.findOne({
            where: {
                email
            }
        });

        // uncomment if want to disable multi device login
        // await db.auth.update({
        //     is_deleted: true,
        //     is_active: false,
        // },{
        //     where: {
        //         user_id: User.user_id
        //     }
        // });

        const authToken = generateToken(50);

        const SaveToken = await db.auth.create({
            user_id: User.user_id,
            auth_token: authToken,
            device_info: { user_agent: req.headers['user-agent'] },
        });

        if (!SaveToken) return res.render("auth/login.html", { email, errors: ['something went wrong, please try again!'] })

        if (authOn == "client") return res.json({
            status: true,
            message: authToken
        });


        console.log("setting cookie")
        console.log("maxAge", (Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 * 12 - Math.floor(Date.now() / 1000)) * 1000)
        res.cookie('authToken', authToken, {
            maxAge: (Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 * 12 - Math.floor(Date.now() / 1000)) * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV == "production" ? true : false,
            domain: process.env.NODE_ENV == "production" ? ".zorlen.com" : "localhost",
            sameSite: process.env.NODE_ENV === "production" ? "Lax" : "Strict",
        })

        // check if user was interrupted in the middle of the browsing, continue where he left of
        if(req.session.redirect){
            const redirect = req.session.redirect;
            req.session.redirect = null;
            return res.redirect(redirect);
            // else, redirect tot he default dashboard
        }
        
        return res.redirect("/dashboard");

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = authorize;