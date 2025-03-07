const db = require("../services/db.service");


const isAuthorized = async (req, res, next) => {
    try{
        const authToken = req.cookies.auth_token;
        if(!authToken){
            return next();
        }
        const Auth = await db.auth.findOne({
            where: {
                auth_token: authToken,
                is_active: true,
                is_deleted: false,
            }
        });
        if(!Auth){
            return next();
        }
        res.redirect("/saves");
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = isAuthorized;