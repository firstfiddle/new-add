const { default: mongoose } = require('mongoose')
const Usermodel = require('../model/user')
const bcrypt = require('bcrypt')
const  nodemailer =require('nodemailer')
const jwt = require('jsonwebtoken')
const randomstring=require('randomstring')
const CourseModel = require('../model/course')
var cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: 'durbsc1w3',
    api_key: '212474534226764',
    api_secret: 'mqEOx-aQoMKES4-wRCdP9KHTl8M',
    //  secure: true
});


class FrontController {
    static home = async (req, res) => {
        try {
            const { name, id, image } = req.user
            const btech = await CourseModel.findOne({ user_id: id, course: 'b.tech' })
            const bca = await CourseModel.findOne({ user_id: id, course: 'bca' })
            const mca = await CourseModel.findOne({ user_id: id, course: 'mca' })
            res.render('home', { n: name, btech: btech, bca: bca, mca: mca, image: image })
        } catch (error) {
            console.log(error)
        }
    }
    static about = async (req, res) => {
        try {
            const { name, id, image } = req.user
            res.render('about', { n: name, image: image })
        } catch (error) {
            console.log(error)
        }
    }
    static contact = async (req, res) => {
        try {
            const { name, id, image } = req.user
            res.render('contact', { n: name, image: image })
        } catch (error) {
            console.log(error)
        }
    }
    static login = async (req, res) => {
        try {
            res.render('login', { message: req.flash('error'),
        msg:req.flash('success')})
        } catch (error) {
            console.log(error)
        }
    }
    static register = async (req, res) => {
        try {
            res.render('register', { message: req.flash('error') })
        } catch (error) {
            console.log(error)
        }
    }
    static forgetload = async (req, res) => {
        try {
            res.render('forget',{message: req.flash('error')})
        } catch (error) {
            console.log(error)
        }
    }
    static profile = async (req, res) => {
        try {
            const { name, id, image, email } = req.user
            res.render('profile', {
                n: name, image: image, e: email, message: req.flash('success'),
                msg: req.flash('error')
            })
        } catch (error) {
            console.log(error)
        }
    }
    static insertreg = async (req, res) => {
        // console.log(req.files.image)
        try {
            // console.log(req.body)
            const { n, e, p, cp } = req.body
            const file = req.files.image
            const myimage = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'AddmisionImage'
            })
            const user = await Usermodel.findOne({email: e})
            console.log(user)

            if (user) {
                req.flash('error', 'Email Alreay Exist')
                res.redirect('/register')
            } else {
                if (n && e && p && cp) {
                    if (p == cp) {
                        const hashpassword = await bcrypt.hash(p, 10)
                        const result = new Usermodel({
                            name: n,
                            email: e,
                            password: hashpassword,
                            image: {
                                public_id: myimage.public_id,
                                url: myimage.secure_url
                            }
                        })
                       const UserData= await result.save() 
                       if(UserData){
                        const token = jwt.sign({ ID: UserData._id}, 'Raksdjf#7767dnnm');
                        res.cookie('token', token)
                        this.sendVerifymail(n,e,UserData._id)
                       }else{
                        req.flash('error', 'Not a Resister User')
                        res.redirect('/')
                       }
                        req.flash('error', 'You are successfully registerd plz verify your mail')
                        res.redirect('/')
                    } else {
                        req.flash('error', 'Password & Confirm Password does not match')
                        res.redirect('/register')
                    }
                } else {
                    req.flash('error', 'All filed are required')
                    res.redirect('/register')
                }
            }
        } catch (error) {
            console.log(error)
        }

        

    }
    static sendVerifymail = async (n,e,user_id) => {
        // console.log(name,email,status,comment)
        // connenct with the smtp server
    
        let transporter = await nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
    
          auth: { 
            user: "onlinemath85@gmail.com",
            pass: "wpxsfkdixdinevsf",
          },
        });
        let info = await transporter.sendMail({
                    from: "test@gmail.com", // sender address
                    to: e, // list of receivers
                    subject: "For Verification mail", // Subject line
                    text: "heelo", // plain text body
                    html:
                      "<p>Hii " +
                      n +
                      ',Please click here to <a href="http://ravibtech.onrender.com/verify?id=' +
                      user_id +
                      '">Verify</a>Your mail</p>.',
                  });
      };
    static verify=async(req,res)=>{
        try {
            const updateinfo = await Usermodel.findByIdAndUpdate(req.query.id, {
                    is_verified: 1,
                  });
                  if(updateinfo)
                  {
                    res.redirect("/home");
                  }
        } catch (error) {
             console.log(error)
        }
    }
    static verifylogin = async (req, res) => {
        try {
            // console.log(req.body)
            const {email, password} = req.body
            if (email && password) {
                const user = await Usermodel.findOne({email: email})
                if (user != null) {
                    const ismatch = await bcrypt.compare(password, user.password)
                    if (ismatch) {
                        if (user.role == 'admin') {
                            const token = jwt.sign({ ID: user._id }, 'Raksdjf#7767dnnm');
                            //console.log(token)
                            res.cookie('token', token)
                            res.redirect('/admin/home')
                        }
                        if (user.role == 'user') {
                            const token = jwt.sign({ ID: user._id }, 'Raksdjf#7767dnnm');
                            //console.log(token)
                            res.cookie('token', token)
                            res.redirect('/home')
                        }else{
                            req.flash('error', 'Go To Mail Section And Verify Mail After You will Excess Your Account')
                        res.redirect('/')
                        }
                    } else {
                        req.flash('error', 'Please cheak User id & password')
                        res.redirect('/')
                    }
                } else {
                    req.flash('error', 'You are not register User')
                    res.redirect('/')
                }
            } else {
                req.flash('error', 'All feild are required')
                res.redirect('/')
            }
        } catch (error) {

        }
    }
    static logout = async (req, res) => {
        try {
            res.clearCookie('token')
            res.redirect('/')
        } catch (error) {
            console.log(error)
        }
    }
    static profileupdate = async (req, res) => {
        try {
            // console.log(req.body)  
            // console.log(req.files.image)
            const { name, email, image } = req.body
            if (req.files) {
                const userImg = await Usermodel.findById(req.user.id)
                const imgId = userImg.image.public_id
                await cloudinary.uploader.destroy(imgId) // for delete IMG
                const file = req.files.image; // for upload image to Cloudnary
                const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
                    // console.log(file)
                    folder: 'AddmisionImage'
                });
                // console.log(imageUpload)
                var data = {
                    name: name,
                    email: email,
                    image: {
                        public_id: imageUpload.public_id,
                        url: imageUpload.secure_url
                    }
                }
                // console.log(imgId)
                // console.log(userImg)
            } else {
                var data = {
                    name: name,
                    email: email,
                }
            }
            await Usermodel.findByIdAndUpdate(req.user.id, data)
            req.flash('success', 'Profile Update Successfully')
            res.redirect('/profile')
        } catch (error) {
            console.log(error)
        }
    }
    static changepassword = async (req, res) => {
        try {
            //console.log(req.body)
            const { op, np, cp } = req.body
            const { id } = req.user
            if (op && np && cp){
                const user=await Usermodel.findById(id)
                const ismatch= await bcrypt.compare(op,user.password)
                if(!ismatch){
                    req.flash('success', 'Current password is incorrect ')
                    res.redirect('/profile')
                }else{
                    if (np != cp) {
                        req.flash('success', 'Password does not match')
                        res.redirect('/profile')
                    } else {
                        const newHashPassword = await bcrypt.hash(np, 10)
                        await Usermodel.findByIdAndUpdate(id, {
                            password: newHashPassword
                        })
                        req.flash('success', 'Password Updated successfully ')
                         res.redirect('/profile')
                }
            }
            }else{
                req.flash('error', 'ALL fields are required ')
                res.redirect('/profile')
            }
    
    
       } catch (error) {
            console.log('error')
        }
    }
    static forgetPasswordVerify = async (req, res) => {
        try {
          const { email } = req.body;
          const userData = await Usermodel.findOne({ email: email });
          //console.log(userData)
          if (userData) {
            const randomString = randomstring.generate();
            await Usermodel.updateOne(
              { email: email },
              { $set: { token: randomString } }
            );
            this.sendEmail(userData.name, userData.email, randomString);
            req.flash("success", "Plz Check Your mail to reset Your Password!");
            res.redirect("/");
          } else {
            req.flash("error", "You are not a registered Email");
            res.redirect("/");
          }
        } catch (error) {
          console.log(error);
        }
      };
     
     //for reset pass send mail
     static sendEmail = async (name, email, token) => {
        // console.log(name,email,status,comment)
        // connenct with the smtp server
    
        let transporter = await nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
    
          auth: { 
            user: "onlinemath85@gmail.com",
            pass: "wpxsfkdixdinevsf",
          },
        });
        let info = await transporter.sendMail({
          from: "test@gmail.com", // sender address
          to: email, // list of receivers
          subject: "Reset Password", // Subject line
          text: "heelo", // plain text body
          html:
            "<p>Hii " +
            name +
            ',Please click here to <a href="http://ravibtech.onrender.com/reset-password?token=' +
            token +
            '">Reset</a>Your Password.',
        });
      };
    //  //rest password clik
    //  static forgetpassword=async(req,res)=>{
    //     try {
    //         const token = req.query.token
    //        const tokendata = await Usermodel.findOne({token:token})
    //        if(tokendata){
    //         res.render('forgetpassword', {user_id:tokendata._id})
    //        }else{
    //         res.render('404',{message:"token is invalid"})
    //        }
            
    //     } catch (error) {
    //         console.log(error)
    //     }
    //  }
     //reset password data
     static resetpassword = async (req, res) => {
        try {
          const token = req.query.token;
          const tokenData = await Usermodel.findOne({ token: token });
          if (tokenData) {
            res.render("reset-password", { user_id: tokenData._id });
          } else {
            res.render("404");
          }
        } catch (error) {
          console.log(error);
        }
      };
      static reset_Password1 = async (req, res) => {
        try {
          const { password, user_id } = req.body;
          const newHashPassword = await bcrypt.hash(password, 10);
          await Usermodel.findByIdAndUpdate(user_id, {
            password: newHashPassword,
            token: "",
          });
          req.flash("success", "Reset Password Updated successfully ");
          res.redirect("/");
        } catch (error) {
          console.log(error);
        }
      };
   
}

module.exports = FrontController
 
 
