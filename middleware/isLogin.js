const jwt=require('jsonwebtoken')
const Usermodel=require('../model/user')

const isLogin=async (req,res,next)=>{
 
    const{token}=req.cookies
    if(token){
           res.redirect('/home')
    }
        next()
    }

module.exports=isLogin