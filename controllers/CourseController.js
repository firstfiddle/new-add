 const CourseModel=require('../model/course')
 const nodemailer=require('nodemailer')

class CourseController{
    static btechforminsert=async(req,res)=>{
        try {
            //console.log(req.body)
            const{name,email,mobile,dob,gender,address,college,course,branch}=req.body
            const result=CourseModel({
                name:name,
                email:email,
                number:mobile,
                dob:dob,
                gender:gender,
                address:address,
                college:college,
                course:course,
                branch:branch,
                user_id:req.user.id
            })
            await result.save()
            this.sendMail (name,email)
            res.redirect('/coursedisplay')

        } catch (error) {
            console.log(error)
        }
    }
    static coursedisplay=async(req,res)=>{
        try {
            const{name,id,image}=req.user
           const data= await CourseModel.find({user_id:id})
           //console.log(data) 
           res.render('course/coursedisplay',{n:name,d:data,image:image,message:req.flash('success')})
        } catch (error) {
            console.log(error)
        }
    }
    static courseview=async (req,res)=>{
           try {
           // console.log(req.params.id)
           const view=await CourseModel.findById(req.params.id)
           const{name,id,image}=req.user
           //console.log(view)
           res.render('course/courseview',{courseview:view,n:name,image:image})
           } catch (error) {
            console.log(error)
           }
    }
    static courseedit=async (req,res)=>{
        try {
        // console.log(req.params.id)
        const edit=await CourseModel.findById(req.params.id)
        const{name,id,image}=req.user
        //console.log(edit)
        res.render('course/courseedit',{courseedit:edit,n:name,image:image})
        } catch (error) {
         console.log(error)
        }
 }
 static courseupdate=async (req,res)=>{
    try {
    // console.log(req.params.id)
    const {id}=req.user
    const{name,email,mobile,dob,gender,address,college,course,branch}=req.body
    await CourseModel.findByIdAndUpdate(req.params.id,{
        name:name,
        email:email,
        number:mobile,
        dob:dob,
        gender:gender,
        address:address,
        college:college,
        course:course,
        branch:branch,
        user_id:req.user.id 
    })
         req.flash('success','course Update Successfully')
         res.redirect('/coursedisplay')
    //console.log(edit)
    
    } catch (error) {
     console.log(error)
    }
}
 static coursedelete=async (req,res)=>{
    try {
    // console.log(req.params.id)
    await CourseModel.findByIdAndDelete(req.params.id)
    req.flash('success','course Delete Successfully')
    res.redirect('/coursedisplay')
    } catch (error) {
     console.log(error)
    }
 }
 static sendMail=async(name,email)=>{
   // console.log(name,email)
   let transporter =await nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    
    auth: { 
      user: "onlinemath85@gmail.com",
      pass: "wpxsfkdixdinevsf",
    },
  });
  let info = await transporter.sendMail({
    from: "text@gmail.com", // sender address
    to: email,  // list of receivers
    subject: "course creat successfully", // Subject line
    text: "Hello world?", // plain text body
    html: `<b>${name} </b> course insert succesfully. pls wait approved`, // html body
  });
 }
}
module.exports=CourseController