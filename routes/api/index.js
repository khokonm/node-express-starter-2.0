const router = require("express").Router();

const AuthRoutes = require("./auth.routes");
const BusinessRoutes = require("./business.routes");

const isAuth = require('@middleware/auth.middleware');

router.use("/auth", AuthRoutes);
router.use("/business", isAuth, BusinessRoutes);

module.exports = router;