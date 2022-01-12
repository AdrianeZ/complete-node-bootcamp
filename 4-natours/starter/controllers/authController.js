const jwt = require("jsonwebtoken");
const {createHash} = require("crypto");
const {promisify} = require("util");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const photoValidator = require("../utils/validators/photoValidator");
const sendEmail = require("../utils/email");
const {use} = require("express/lib/router");

function signToken(id)
{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

function createSendToken(user, statusCode, res, login = false)
{
    const token = signToken(user._id);
    if (login) {
        res.status(statusCode).json(
            {
                status: "success",
                token,
            }
        )
    } else {
        res.status(statusCode).json(
            {
                status: "success",
                token,
                user
            }
        )
    }
}

function hashToken(token)
{
    return createHash("sha256").update(token).digest("hex");
}

async function signUp(req, res, next)
{
    try {

        const {name, email, password, passwordConfirm, photo, role} = req.body;
        photoValidator(photo);
        const newUser = await User.create(
            {
                name,
                email,
                password,
                passwordConfirm,
                photo,
                role
            }
        );
        newUser.password = undefined;
        createSendToken(newUser, 201, res);
    } catch (error) {
        next(error);
    }

}

async function logIn(req, res, next)
{
    const {email, password} = req.body;

    if (!email || !password) {
        return next(new AppError("Please Provide Correct Credentials", 400));
    }

    const user = await User.findOne({email}).select("+password");
    const isCorrectPassword = await user?.correctPassword(password);

    if (!user || !isCorrectPassword) {
        return next(new AppError("Incorrect Email and Password", 401));
    }

    createSendToken(user, 200, res, true);

}

async function protect(req, res, next)
{
    let token;
    const {authorization} = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
        token = authorization.split(" ")[1];
    }
    if (!token) {
        return next(new AppError("You are not Logged In! Please log in to get access", 401))
    }

    try {
        const verify = promisify(jwt.verify);
        const payload = await verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.id).select("+password");
        if (!user) throw new AppError("Token is invalid because user does not exists already", 401);
        const invalidTimestamps = user.verifyChangedPassword(payload.iat);
        if (invalidTimestamps) throw new AppError("Token is invalid because password was changed please regenerate your token", 401);

        // Przekazanie zalogowanego użytkownika do następnego middleware
        req.loggedUser = user;
    } catch (error) {
        return next(error);
    }

    next();
}

function authorize(...roles)
{
    return function (req, res, next) {
        if (!roles.includes(req.loggedUser.role)) return next(new AppError("Your not authorized to perform this action", 403));
        else next();
    }
}

async function forgotPassword(req, res, next)
{
    const {email} = req.body;
    let resetToken, user;
    try {
        if (!email || !email.includes("@")) throw new AppError(`email ${email} is incorrect`, 400);
        user = await User.findOne({email});
        if (!user) throw new AppError(`user with email ${email} not exists`, 404);
        resetToken = await user.generatePasswordResetToken();
        await user.save({validateBeforeSave: false});
    } catch (error) {
        return next(error);
    }

    try {
        const resetUrl = `${req.protocol}://${req.get("host")}/api/users/resetPassword/${resetToken}`;
        const message = "Forgot your Password? Submit a Patch Request with your new password and password confirm to " + resetUrl + "\n" +
            "if tou didn't forget your password please ignore this email";
        const subject = "Your password reset token (valid for 10 min)";
        await sendEmail({email, subject, message});
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false});
        console.log(error);
        return next(new AppError("There was an error sending the email try again later", 500));
    }

    res.json(
        {
            status: "success",
            message: "token sent to email"
        }
    );
}

async function resetPassword(req, res, next)
{

    try {
        const user = await User.findOne({
            passwordResetToken: hashToken(req.params.token), passwordResetExpires: {$gte: new Date()}
        });
        if (!user) throw new AppError("Token is invalid or has expired", 400);

        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordChangedAt = new Date() - 1000;
        user.passwordResetExpires = undefined;
        user.passwordResetToken = undefined;
        await user.save();
        createSendToken(user, 200, res);
    } catch (error) {
        return next(error);
    }
}

async function updatePassword(req, res, next)
{
    const {currentPassword, password, passwordConfirm} = req.body;
    const {loggedUser} = req;
    try {
        const isCorrectPassword = await loggedUser?.correctPassword(currentPassword);
        if (!isCorrectPassword) throw new AppError("Current Password is invalid", 401);

        //User.FindByIdAndUpdate will Not work as intended!
        loggedUser.password = password;
        loggedUser.passwordConfirm = passwordConfirm;
        loggedUser.passwordChangedAt = new Date() - 1000;
        await loggedUser.save();
        createSendToken(loggedUser, 200, res);
    } catch (error) {
        return next(error);
    }

}

module.exports =
    {
        signUp,
        logIn,
        protect,
        authorize,
        forgotPassword,
        resetPassword,
        updatePassword
    };