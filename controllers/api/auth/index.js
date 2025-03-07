const { Op } = require("sequelize");
const dotenv = require('dotenv');
const axios = require("axios");
const db = require("@services/db.service");
const events = require("@services/event.service");
const authorize = require("@utils/authorize.util");
const googleLoginUrl = require("@utils/googleLoginUrl.util");
const sendResponse = require('@utils/responseHandler.util');
const bcrypt = require("bcryptjs");
const asyncHandler = require('@utils/asyncHandler.util');

const validate = require("@validations/validate");
const  registerSchema = require('@validations/auth/register.validation');
dotenv.config({ path: '.env' });

exports.SendOTP = asyncHandler(async (req, res) => {
    const { email } = req.fields;

    if (!email) return sendResponse(res, 400, 'Email is required');


    // send an otp and proceed the OTP based login
    const authToken = Math.floor(Math.random() * (999999 - 100000) + 100000);
    const user_ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
    let seconds = new Date().getTime() / 1000;
    let five_minutes = 60 * 5;
    let authCodeExpiry = seconds + five_minutes;

    // select all the auth tokens of the user sent in last one hour 
    const authTokens = await db.auth_token.findAll({
        where: {
            user_ip,
            is_used: false,
            createdAt: {
                [Op.gte]: new Date(new Date() - 30 * 60 * 1000)
            }
        }
    });


    if (authTokens.length > 4) return sendResponse(res, 429, 'Too many requests! Please try again later.');

    // create a new auth token
    await db.auth_token.create({
        email,
        user_ip,
        auth_token: authToken,
        expiry: authCodeExpiry,
    });

    console.log("auth token created")

    // send the OTP token 
    // await sendSMS(phone, `Your OTP is ${authToken}`);
    events.emit("SEND_MAIL", {
        email,
        authToken
    })


    return sendResponse(res, 200, 'OTP is sent!');

})

exports.LoginWithOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.fields;

    if (!email || !otp) return sendResponse(res, 400, 'Email and OTP is required');

    const AuthToken = await db.auth_token.findOne({
        where: {
            email,
            auth_token: otp,
            is_used: false,
        }
    });
    if (!AuthToken) return sendResponse(res, 400, "Invalid OTP!");

    let seconds = new Date().getTime() / 1000;
    if (AuthToken.expiry < seconds) return sendResponse(res, 400, "OTP Expired!");
    await db.auth_token.update({
        is_used: true,
    }, {
        where: {
            auth_token_id: AuthToken.auth_token_id,
        }
    });

    const User = await db.user.findOne({
        where: {
            email,
        }
    });

    if (!User) {
        await db.user.create({
            email,
        });
    }

    return authorize(req, res, email);
})

exports.LoginWithPassword = async (req, res) => {
    try{
        const { email, password } = req.fields;

        if (!email || !password) return sendResponse(res, 400, 'Email and password is required');

        const User = await db.user.findOne({
            where: {
                email,
            }
        });

        if(!User) return sendResponse(res, 400, 'Invalid email or password');

        const isMatch = await bcrypt.compare(password, User.password ?? '');

        if(!isMatch) return sendResponse(res, 400, 'Invalid email or password');
        
        return authorize(req, res, email);
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message: "Internal Server Error",
        })
    }
}

exports.Register = async (req, res) => {
    try{    
        const validationError = validate(registerSchema, req.fields, res);
        if (validationError) return;

        const { name, email, password } = req.fields;

        const User = await db.user.findOne({
            where: {
                email,
            }
        });
        
        if(User) return sendResponse(res, 400, "Email already exist!");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.user.create({
            name,
            email,
            password: hashedPassword,
        });
        
        return authorize(req, res, email);
        


        // const newUser = await db.user.create({
        //     email,
        //     name,
        //     password,
        //     default_auth_method: 'password'
        // });
        // if(!newUser){
        //     errors.push("Something went wrong!");
        //     return res.render("auth/register.html", { email, errors });
        // }
        // return res.render("auth/password.html", { email });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message: "Internal Server Error",
        })
    }
}

exports.GoogleOAuth = asyncHandler(async (req, res) => {

    const { error, code } = req.query;
    if (error) {
        return sendResponse(res, 500, "Something went wrong!");
    }
    const { data } = await axios({
        url: `https://oauth2.googleapis.com/token`,
        method: 'post',
        data: {
            client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
            client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            redirect_uri: 'https://readaway.app/api/auth/google',
            grant_type: 'authorization_code',
            code,
        },
    });
    // console.log(data); // { access_token, expires_in, token_type, refresh_token }
    const access_token = data.access_token;

    const getData = await axios({
        url: 'https://www.googleapis.com/oauth2/v2/userinfo',
        method: 'get',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    // console.log(getData.data); // { id, email, given_name, family_name }
    //   const sampleData = {
    //     "id": "114332184919303946706",
    //     "email": "user_email@gmail.com",
    //     "verified_email": true,
    //     "name": "Md Khokon",
    //     "given_name": "Md",
    //     "family_name": "Khokon",
    //     "picture": "PHOTO_URL_HERE",
    //     "locale": "en"
    //   };
    const googleUserData = getData.data;

    const User = await db.user.findOne({
        where: {
            email: googleUserData.email
        }
    });
    if (!User) {
        await db.user.create({
            email: googleUserData.email,
            name: googleUserData.name,
            avatar: googleUserData.picture,
        });
    }
    return authorize(req, res, googleUserData.email, "server");

})

exports.GoogleRedirect = async (req, res) => {
    res.redirect(googleLoginUrl);
}

exports.PasswordReset = asyncHandler(async (req, res) => {
    const { email, otp, password } = req.fields;

    if (!email || !otp || !password) return sendResponse(res, 400, 'Email, OTP and password are required');

    const AuthToken = await db.auth_token.findOne({
        where: {
            email,
            auth_token: otp,
            is_used: false,
        }
    });
    if (!AuthToken) return sendResponse(res, 400, "Invalid OTP!");

    let seconds = new Date().getTime() / 1000;
    if (AuthToken.expiry < seconds) return sendResponse(res, 400, "OTP Expired!");

    const User = await db.user.findOne({
        where: {
            email,
        }
    });

    if (!User) return sendResponse(res, 400, "User not found!");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.user.update({
        password: hashedPassword,
    }, {
        where: {
            user_id: User.user_id
        }
    });

    await db.auth_token.update({
        is_used: true,
    }, {
        where: {
            auth_token_id: AuthToken.auth_token_id,
        }
    });

    return sendResponse(res, 200, "Password reset successful!");
});

exports.Logout = asyncHandler(async (req, res) => {
    const authToken = req.cookies.auth_token;
    if (authToken) {
        await db.auth.update({
            is_deleted: true,
            is_active: false
        }, {
            where: {
                auth_token: authToken
            }
        });
    }
    req.session.destroy();
    res.cookie('authToken', '', { maxAge: 1 });
    return res.redirect("/");
});