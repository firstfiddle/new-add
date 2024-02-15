const express = require('express')
const app = express()
const port = 1000

const web = require('./routes/web')
const connectdb = require('./db/connectdb')
const fileUpload = require("express-fileupload");
var cloudinary = require('cloudinary')
// session ,flash require karne honge
const session = require('express-session')
const flash = require('connect-flash')
 
//connet db
connectdb()
// cookie data get k liye
const cookieparser = require('cookie-parser')

app.use(cookieparser())
// css static file link
app.use(express.static('public'))
//templete enging 
app.set('view engine', 'ejs')

// parse url k data obj me change karne 
app.use(express.urlencoded({ extended: false }))
// for file upload
app.use(fileUpload({ useTempFiles: true }));
//message
app.use(session({ // is se messgee waha pr ayega
        secret: 'secret',
        cookie: { maxAge: 60000 },
        resave: false,
        saveUinitialized: false,
}));
//flase message  message dikhega waha pr
app.use(flash())

//route
app.use('/', web)

//server creat
app.listen(port, () => {
        console.log(`server is running local host: ${port}`)
})