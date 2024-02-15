const mongoose=require('mongoose')
//field
 const UserSchema= new mongoose.Schema({
    name:{
        type:String,
        Required:true
    },
    email:{
        type:String,
        Required:true
    },
    password:{
        type:String,
        Required:true
    },
    image:{
        public_id:{
            type:String,
            Required:true
        },
        url:{
            type:String,
            Required:true
        }
    },
    role:{
        type:String,
        default:'user'
    },
    verify:{
        type:String,
        default:'0'
    },
    token:{
        type:String,
        default:''
    }
 },{timestamps:true})

 //model
 const Usermodel=mongoose.model('user', UserSchema)
 module.exports=Usermodel