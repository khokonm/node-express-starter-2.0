const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const Sesssion = session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false, // Changed to false to prevent creating sessions for unauthenticated users
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict' // Prevents the browser from sending the cookie along with cross-site requests
    }
});
module.exports = Sesssion;