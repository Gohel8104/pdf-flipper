const { register, login, checkAuth } = require("../Controllers/Authcontrollers")
const { checkUser } = require("../Middlewares/AuthMiddlewares")
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per window
  handler: (req, res, next) => {
    res.status(429).json({ message: 'Too many login attempts, please try again later.' });
  },
  keyGenerator: (req) => {
    return req.ip; // Use IP address as the key
  }
});

const router=require("express").Router()
router.post("/",checkUser)
router.post("/register",register)
router.post("/login",loginLimiter,login)
router.post("/checkAuth",checkAuth)

module.exports=router;
