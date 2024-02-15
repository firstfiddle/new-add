const { render } = require('ejs')
const nodemailer=require('nodemailer')
const CourseModel=require('../model/course')
class AdminController {
  
    static getuserdisplay=async(req,res)=>{
        try {
            const {name,image}=req.user
            const course= await CourseModel.find()
            res.render('admin/getuserdisplay',{n:name,image:image,c:course,message:req.flash('success')})
        } catch (error) {
            console.log('error')
        }
    }
    static courseview=async (req,res)=>{
        try {
        // console.log(req.params.id)
        const view=await CourseModel.findById(req.params.id)
        const{name,id,image}=req.user
        //console.log(view)
        res.render('admin/userview',{courseview:view,n:name,image:image})
        } catch (error) {
         console.log(error)
        }
 }
     static courseedit=async(req,res)=>{
    try {
        // console.log(req.params.id)
        const edit=await CourseModel.findById(req.params.id)
        const{name,id,image}=req.user
        //console.log(edit)
        res.render('admin/useredit',{courseedit:edit,n:name,image:image})
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
        })
             req.flash('success','course Update Successfully')
             res.redirect('/admin/home')
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
    res.redirect('/admin/home')
    } catch (error) {
     console.log(error)
    }
 }
 static updatestatus=async (req,res)=>{
    try {
        const { comment, name, email, status } = req.body
        await CourseModel.findByIdAndUpdate(req.params.id,{
            comment: comment,
            status: status
        })
        this.sendMail(name,email,status,comment)
        res.redirect('/admin/home')
    } catch (error) {
        
    }
 }
 static sendMail=async(name,email,status,comment)=>{
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
     subject: ` Course ${status}`, // Subject line
     text: "heelo", // plain text body
     html: `<b>${name}</b> Course  <b>${status}</b> successful! <br>
      <b>Comment from Admin</b> ${comment} `, // html body
   });
  }
}
 


module.exports=AdminController