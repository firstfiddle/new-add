const express=require('express')
const FrontController = require('../controllers/FrontController')
const chekUserAuth=require('../middleware/auth')
const CourseController = require('../controllers/CourseController')
const AdminController = require('../controllers/AdminController')
const route=express.Router()
 
 route.get('/',FrontController.login)

 route.get('/home',chekUserAuth,FrontController.home)
 route.get('/about',chekUserAuth,FrontController.about)
 route.get('/contact',chekUserAuth,FrontController.contact)
 route.get('/profile',chekUserAuth,FrontController.profile)
 route.get('/register',FrontController.register)
 route.post('/insertreg',FrontController.insertreg)
 route.post('/verifylogin',FrontController.verifylogin)
 route.post('/forgot_Password',FrontController.forgetPasswordVerify)
 
 
 //rest password click path
 
 route.get('/logout',FrontController.logout)
 route.post('/profileupdate',chekUserAuth,FrontController.profileupdate)
 route.post('/changepassword',chekUserAuth,FrontController.changepassword)
 //course controller //insert update me post use hota h
 route.post('/btechforminsert',chekUserAuth,CourseController.btechforminsert)
 route.get('/coursedisplay',chekUserAuth,CourseController.coursedisplay)
 route.get('/courseview/:id',chekUserAuth,CourseController.courseview)
 route.get('/courseedit/:id',chekUserAuth,CourseController.courseedit)
 route.get('/coursedelete/:id',chekUserAuth,CourseController.coursedelete)
 route.post('/courseupdate/:id',chekUserAuth,CourseController.courseupdate)
 
 //Admin Controller
 route.get('/admin/home',chekUserAuth,AdminController.getuserdisplay)
 route.post('/update_status/:id',chekUserAuth,AdminController.updatestatus)
 route.get('/admin/courseview/:id',chekUserAuth,AdminController.courseview)
 route.get('/admin/courseedit/:id',chekUserAuth,AdminController.courseedit)
 route.get('/admin/coursedelete/:id',chekUserAuth,AdminController.coursedelete)
 route.post('/admin/courseupdate/:id',chekUserAuth,AdminController.courseupdate)
 
 

module.exports=route