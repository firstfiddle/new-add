const mongoose=require('mongoose')
const livedb='mongodb+srv://veerprajapati173:Ravi2004@cluster0.ngfq6if.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const connectdb=()=>{
    return mongoose.connect(livedb)
     .then(()=>{
        console.log('connected succesfully')
     }).catch((err)=>{
        console.log('not conneted')
     })
}
module.exports=connectdb