
const router=require("express").Router();
router.post('/',(req,res)=>res.json([{user:'A',score:0.9}]));
module.exports=router;
