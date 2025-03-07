const router = require("express").Router();
const ViewControllers = require("../controllers/views/index");

router.get("/", ViewControllers.Home);
router.get("/auth/login", ViewControllers.Login);
router.get("/auth/register", ViewControllers.Register);
router.get("/auth/forgot-password", ViewControllers.ResetPassword);

router.get("/terms", ViewControllers.Terms);
router.get("/privacy", ViewControllers.Privacy);
router.get("/api-playground", ViewControllers.ApiPlayground);


module.exports = router;