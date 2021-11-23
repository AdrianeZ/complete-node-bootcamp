const mongoose = require("mongoose");
const emailValidator = require("../utils/validators/emailValidator");

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
            minlength:[8, "password must contain at least 8 characters"]
          },
      passwordConfirm:
          {
            type:String,
            required:[true, "you must provide confirmPassword"],
          }
    }
);

const User = mongoose.model("user", userSchema);

module.exports = User;