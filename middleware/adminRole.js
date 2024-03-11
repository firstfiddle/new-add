const jwt=require('jsonwebtoken')

const authRoles=(roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            req.flash('error','Unauthrized user plz login')
            res.redirect('/')
        }
        next()
    }
}
module.exports=authRoles