
const router=require("express").Router();
router.use("/auth",require("../modules/auth/routes"));
router.use("/user",require("../modules/user/routes"));
router.use("/matches",require("../modules/matching/routes"));
router.use("/intelligence",require("../modules/intelligence/routes"));
router.use("/startup",require("../modules/startup/routes"));
router.use("/marketplace",require("../modules/marketplace/routes"));
router.use("/network",require("../modules/graph/routes"));
router.use("/builder",require("../modules/builder/routes"));
module.exports=router;
