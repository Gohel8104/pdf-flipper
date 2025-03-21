const UserModel = require("../Models/UserModel");
const jwt=require("jsonwebtoken")
require('dotenv').config();

const max_age=3*24*60*60

const createToken=(id)=>{
  return jwt.sign({id},process.env.JWT_SECRET,{
    expiresIn:max_age,
  })
}


const handleErrors =(err)=>{
    let errors = {email:"",password:""}

    if (err.message) {
      const errorMessages = {
        "Email is required": "Email is required",
        "Invalid email format": "Invalid email format",
        "Password is required": "Password is required",
        "Password should have at least one uppercase letter": "Password should have at least one uppercase letter",
        "Password should have at least one special character": "Password should have at least one special character",
        "Password must be at least 8 characters long": "Password must be at least 8 characters long",
        "Incorrect Email": "Incorrect Email",
        "Incorrect Password": "Incorrect Password",
      };
  
      if (errorMessages[err.message]) {
        if (err.message.startsWith("Email")) {
          errors.email = errorMessages[err.message];
        } else {
          errors.password = errorMessages[err.message];
        }
      }
    }
     
    if(err.errorResponse){
        if(err.errorResponse.code === 11000){
            errors.email="Email is already resgistered"
            return errors
        } 
    }
    if (err.errors) {
        for (let field in err.errors) {
          if (errors.hasOwnProperty(field)) {
            errors[field] = err.errors[field].message;
          }
        }
    }
   
    return errors
}


const validateInput = (email, password) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw Error("Invalid email format");
  }

  if (!password) {
    throw Error("Password is required");
  }
  if (!/[A-Z]/.test(password)) {
    throw Error("Password should have at least one uppercase letter");
  }
  if (!/[!@#$%^&*]/.test(password)) {
    throw Error("Password should have at least one special character");
  }
  if (password.length < 8) {
    throw Error("Password must be at least 8 characters long");
  }
};



module.exports.register = async(req,res,next)=>{
  console.log("in register")
    try{
        const {email,password}=req.body;
        validateInput(email, password);
        const user=await UserModel.create({email,password})
        const token=createToken(user._id)
        console.log(token)
        console.log("efrferferf",user._id)
        res.status(201).json({user:token,created:true})
     }
     catch(err){
        //   console.log(err)
          const errors=handleErrors(err)
        //   console.log(errors)
          res.json({errors,created:false})
     }
}


module.exports.login = async(req,res,next)=>{
  
    try{
      
        const {email,password}=req.body;
    
        const user=await UserModel.login(email,password)
        const token=createToken(user._id)
        console.log(token)
        console.log(user._id)
        res.status(200).json({user:token,created:true})
     }
     catch(err){
          const errors=handleErrors(err)
          res.json({errors,created:false})
     }}

module.exports.checkAuth = async (req, res, next) => {
  try {
    const {token} = req.body;
     console.log(typeof token)
    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ message: 'Token is valid', userId: decoded.id });
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};



