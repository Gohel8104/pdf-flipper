const mongoose=require("mongoose")
const bcrypt=require("bcrypt")

const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is Required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password is Required"]
    }
})

UserSchema.pre("save",async function(next){
const salt = await bcrypt.genSalt();
this.password=await bcrypt.hash(this.password,salt)
next()
})

UserSchema.statics.login=async function(email,password){
    if (!email) {
        throw Error("Email is required");
      }
      if (!password) {
        throw Error("Password is required");
      }
    const user=await this.findOne({email})
    if(user){
        const auth=await bcrypt.compare(password,user.password)
        if(auth){
            return user
        }
        throw Error("Incorrect Password")
    }
    throw Error("Incorrect Email")
}

module.exports=mongoose.model("Users",UserSchema)
