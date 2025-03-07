const router = require("express").Router();

const ViewRoutes = require("./view.routes");
// const AuthRoutes = require("./auth.routes");
const ProtectedRoutes = require("./protected.routes");

const ApiRoutes = require("./api");

const isAuth = require("../middleware/auth.middleware");

router.use("/", ViewRoutes);
// router.use("/auth", AuthRoutes);
router.get("/test", (req, res) => res.send(" Hello world"));
router.use("/api", ApiRoutes);
router.use("/dashboard", ProtectedRoutes);

module.exports = router;