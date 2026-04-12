
const router=require("express").Router();
router.get('/profile',(req,res)=>res.json({name:'User'}));
module.exports=router;
