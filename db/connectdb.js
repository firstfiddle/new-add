const mongoose=require('mongoose')
const livedb='mongodb+srv://veerprajapati173:Ravi2003@cluster0.8lced4w.mongodb.net/admission-prcopy?retryWrites=true&w=majority'
const localdb='mongodb://127.0.0.1:27017/admission-prcopy'
const connectdb=()=>{
    return mongoose.connect(livedb)
     .then(()=>{
        console.log('connected succesfully')
     }).catch((err)=>{
        console.log('not conneted')
     })
}
module.exports=connectdb