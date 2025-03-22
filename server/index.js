const express=require("express")
const cors=require("cors")
const mongoose=require("mongoose")
const authRoutes =require("./Routes/AuthRoutes")
const app=express()
const cookieParser = require("cookie-parser");
require('dotenv').config();
const port=process.env.PORT || 4000
mongoose
  .connect(process.env.MONGO_URI) 
  .then(() => {
    console.log("DB connected successfully");
  })
  .catch((error) => {
    console.error("Error connecting to DB:", error);
  });
app.use(cookieParser())

app.use(cors({
  origin: 'https://shorturlfrontend.vercel.app', // Allow only your frontend
  credentials: true, // Enable credentials (cookies, authentication headers)
}));
app.use(express.json());

app.use("/",authRoutes)

app.listen(port,()=>console.log("server started at port 4000"))



