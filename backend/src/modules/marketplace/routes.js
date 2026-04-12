
const router=require("express").Router();
router.get('/',(req,res)=>res.json([{deal:'Seed'}]));
module.exports=router;
