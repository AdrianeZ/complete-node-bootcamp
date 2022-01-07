const {randomBytes, createHash} = require("crypto");
const {promisify} = require("util");
const randomBytesPromises = promisify(randomBytes);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const emailValidator = require("../utils/validators/emailValidator");
const passwordValidator = require("../utils/validators/passwordValidator");
const AppError = require("../utils/AppError");

const userSchema = new mongoose.Schema(
    {
        name:
            {
                type: String,
                trim: true,
                required: [true, "Username must be set"]
            },
        email:
            {
                type: String,
                unique: true,
                trim: true,
                lowercase: true,
                required: [true, "email must be set"],
                validate:
                    {
                        validator: emailValidator,
                        message: "Email is invalid"
                    }
            },
        photo:
            {
                type: String,
            },

        role:
            {
                type: String,
                enum: ["user", "guide", "lead-guide", "admin"],
                default: "user"
            },
        password:
            {
                type: String,
                required: [true, "password must be set"],
                minlength: [8, "password must contain at least 8 characters"],
                select: false
            },
        passwordConfirm:
            {
                type: String,
                required: [true, "you must provide confirmPassword"],
                //this only works on Create and Save!!!
                validate:
                    {
                        validator: passwordValidator,
                        message: "Passwords must be the same!!!"
                    }
            },
        passwordChangedAt:
            {
                type: Date
            },
        passwordResetToken: String,
        passwordResetExpires: Date

    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
})

userSchema.methods.correctPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

userSchema.methods.verifyChangedPassword = function (jwtIAT) {
    if (this.passwordChangedAt) {
        const timestamp = parseInt(this.passwordChangedAt.getTime() / 1000);
        return jwtIAT < timestamp;
    }
    return false;
}

userSchema.methods.generatePasswordResetToken = async function () {
    const token = (await randomBytesPromises(32)).toString("hex");
    this.passwordResetToken = createHash("sha256").update(token).digest("hex");
    this.passwordResetExpires = new Date(Date.now() + 600000);
    return token;

}

const User = mongoose.model("user", userSchema);

module.exports = User;