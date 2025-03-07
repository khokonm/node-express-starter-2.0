const router = require("express").Router();
const authController = require("@controllers/api/auth");

// send OTP
router.post("/send_otp", authController.SendOTP);
// login with OTP
router.post("/login", authController.LoginWithOTP);

// Password Based Auth
router.post("/login-password", authController.LoginWithPassword);
router.post("/register-password", authController.Register);

// Google OAuth
router.get("/with-google", authController.GoogleRedirect);
router.get("/google", authController.GoogleOAuth);

// Password Reset
router.post("/password-reset", authController.PasswordReset);

router.get('/logout', authController.Logout);

module.exports = router;