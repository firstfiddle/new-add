const jwt=require('jsonwebtoken')
const Usermodel=require('../model/user')
const chekUserAuth=async(req,res,next)=>{
    //console.log( 'hello middle ware')
    const{token}=req.cookies
    //console.log(token)
    if(!token){
        req.flash('error','Unauthorized Login')
        res.redirect('/')
    }else{
        const verifytoken= jwt.verify(token,'Raksdjf#7767dnnm')
        //console.log(verifytoken)
        const user= await Usermodel.findOne({_id:verifytoken.ID})
       // console.log(user)
       req.user=user
        next()
    }
}
module.exports=chekUserAuth