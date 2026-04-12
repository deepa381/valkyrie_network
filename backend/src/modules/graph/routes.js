
const router=require("express").Router();
router.get('/',(req,res)=>res.json({nodes:[],edges:[]}));
module.exports=router;
