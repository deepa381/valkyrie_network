
const router=require("express").Router();
router.use("/auth",require("../modules/auth/routes"));
router.use("/user",require("../modules/user/routes"));
router.use("/match",require("../modules/matching/routes"));
router.use("/intelligence",require("../modules/intelligence/routes"));
router.use("/startup",require("../modules/startup/routes"));
router.use("/marketplace",require("../modules/marketplace/routes"));
router.use("/graph",require("../modules/graph/routes"));
router.use("/builder",require("../modules/builder/routes"));
module.exports=router;
