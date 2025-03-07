const db = require("@services/db.service");


const isAuthorized = async (req, res, next) => {

    try {
        // console.log(req.cookies, "req.cookies");
        let authToken = req.cookies.authToken;
        // console.log(authToken, "authToken");
        // let authType = req.headers['token'] ? "api" : "website";
        if (!authToken) {
            authToken = req.headers['token'];
        }
        if (!authToken) {
            req.session.error = ["Please login to continue!"];
            // if(authType == 'website')
            // return res.redirect(`/auth?redirect=${req.originalUrl}`);
            // else
            return res.status(401).json({
                status: false,
                message: "Access Denied!"
            })
        }

        const Auth = await db.auth.findOne({
            where: {
                auth_token: authToken,
                is_active: true,
                is_deleted: false
            }
        });

        if (!Auth) {
            // clear cookie
            res.clearCookie('auth_token');
            req.session.error = ["Please login to continue!"];
            // if(authType == 'website')
            // return res.redirect(`/auth?redirect=${req.originalUrl}`);
            // else
            return res.status(401).json({
                status: false,
                message: "Access Denied!",
            })
        }

        const user_id = Auth.user_id;
        const auth_id = Auth.auth_id;
        // update auth last activity
        // await db.auth.update({
        //     last_activity: new Date()
        // },{
        //     where: {
        //         auth_id
        //     }
        // });
        const User = await db.user.findOne({
            where: {
                user_id,
                is_deleted: false
            }
        });
        req.user = User;
        res.locals = {
            User
        };

        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = isAuthorized;