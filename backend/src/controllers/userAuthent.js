// this is the file for the login or signup
const redisClient = require("../config/redis");
const User = require('../models/user')
const validate = require('../utils/validator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Submission=require('../models/submission');

// for the first time user
const register = async (req, res) => {
    try {
        // validate the data
        validate(req.body);
        const { firstName, emailId, password } = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        req.body.role='user';

        const user = await User.create(req.body);
        const token = jwt.sign(
            { _id: user._id, emailId: emailId, role:'user' },
            process.env.JWT_KEY,
            { expiresIn: 60 * 60 }
        );
       
        const reply= {
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id,
            role:user.role
        }

        res.cookie('token', token, { maxAge: 60*60*1000 });
     res.status(201).json({
            user:reply,
            message:'logged in successfully'});
       }   

    catch (err) {
   console.error("Register Error:", err);
    res.status(400).json({ message: err.message, stack: err.stack });
   }
}

// for the login user
const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;
        
        if (!emailId) throw new Error('Invalid Credentials');

        if (!password) throw new Error('Invalid Credentials');

        const user = await User.findOne({ emailId }); //to fetch the email id

        const match = await  bcrypt.compare(password, user.password);

        // if password is provided, and not matched 
        if (!match) throw Error('Invalid Credentials');
        
        const reply= {
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id,
            user:user.role
        }

        // else we generate new token
        const token = jwt.sign({ _id: user._id, emailId: emailId, role:user.role }, process.env.JWT_KEY, { expiresIn: 60 * 60 });
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 });
        res.status(200).json({
            user:reply,
            message:'logged in successfully'});
    }
    catch (err) {
   console.error("Login Error:", err);
    res.status(401).json({ message: err.message, stack: err.stack });
   }
}

// logout feature

const logout = async (req, res) => {
    
    try {
      const {token}= req.cookies; //get the token
      const payload=jwt.decode(token); //get the payload of it
      
      await redisClient.set(`token:${token}`,'Blocked'); //blocked the token
      await redisClient.expireAt(`token:${token}`,payload.exp); //set the expirey of it as well
     
        //    Token add kar dung Redis ke blockList
    //    Cookies ko clear kar dena.....

    res.cookie('token',null,{expires:new Date(Date.now())}); //set the new date to the current date
    res.send('Logged out successfully');    
    }

    catch (err) {
   console.error("Register Error:", err);
    res.status(503).json({ message: err.message, stack: err.stack });
   }
}


// here we involving the admin register controls AS WELL

const adminRegister= async(req,res)=>{
    
    try{
    //    validate the data
    //   if(req.result.role!='admin') throw new Error('Invalid Credentials');     
     validate(req.body); 
     const {firstName , emailId , password } =req.body;

     req.body.password= await bcrypt.hash(password,10);

    //  after the validattion
     const user=await User.create(req.body);
     const token=jwt.sign(
        { _id:user._id, emailId:emailId,role:user.role },
        process.env.JWT_KEY,
        {expiresIn:60*60}
    );

    res.cookie('token',token,{maxAge:60*60*1000});
    res.status(201).send('User Registration Successfully');
    }
    catch(err){
      res.status(400).send("Error"+err);
    }
}

const deleteProfile=async(req,res)=>{
    try{
        const userId=req.result._id;

        // userSchema delete
    await User.findByIdAndDelete(userId);

    // Submission se bhi delete karo...
    
    // await Submission.deleteMany({userId});
    //   this can be achieved by the use of pre and post functions
    

    res.status(200).send("Deleted Successfully");

    }
    catch(err){
      
        res.status(500).send("Internal Server Error");
    }
}
module.exports = { register, login, logout, adminRegister,deleteProfile };