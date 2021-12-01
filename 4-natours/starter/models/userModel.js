const mongoose = require("mongoose");
const emailValidator = require("../utils/validators/emailValidator");
const passwordValidator = require("../utils/validators/passwordValidator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
      name:
          {
            type:String,
            trim: true,
            required:[true, "Username must be set"]
          },
      email:
          {
            type:String,
            unique: true,
            lowercase: true,
            trim: true,
            required:[true, "email must be set"],
            validate:
                {
                  validator: emailValidator,
                  message: "Email is invalid"
                }
          },
      photo:
          {
            type:String,
          },
      password:
          {
            type:String,
            required: [true, "password must be set"],
            minlength:[8, "password must contain at least 8 characters"],
            select: false
          },
      passwordConfirm:
          {
            type:String,
            required:[true, "you must provide confirmPassword"],
            //this only works on Create and Save!!!
            validate:
                {
                  validator:passwordValidator,
                  message:"Confirmed Password is not Equal!!!"
                }
          }
    }
);


userSchema.pre("save", async function(next)
{
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();


})

const User = mongoose.model("user", userSchema);

module.exports = User;