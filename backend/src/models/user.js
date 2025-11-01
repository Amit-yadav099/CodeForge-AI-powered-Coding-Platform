// here we nmake our schemea of the databse
const mongoose=require('mongoose');

const {Schema}=mongoose;

const userSchema = new Schema({
  firstName:{
    type:String,
    require:true,
    minLength:3,
    maxLength:20
  },
  lastName:{
    type:String,
    minLength:3,
    maxLength:20,
  },
  emailId:{
    type:String,
    require:true,
    unique:true,
    trim:true,
    lowercase:true,
    immutable:true,
  },
  age:{
    type:Number,
    min:6,
    max:80,
  },
  role:{ //two types of the role. user regualr user and admin (admin got the better access fo the it)
    type:String, 
    enmum:['user','admin'],
    default:'user'
  },
  problemSolved:{
    type:[string]
  }
 } ,{
    timestamps:true
 });

 const User= mongoose.model('user', userSchema);
 module.exports=User;
