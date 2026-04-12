
const router=require("express").Router();
router.get('/',(req,res)=>res.json([{name:'Startup'}]));
module.exports=router;
