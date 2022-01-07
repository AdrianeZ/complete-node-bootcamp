const jwt = require("jsonwebtoken");
const {promisify} = require("util");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const photoValidator = require("../utils/validators/photoValidator");

function signToken(id)
{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
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

        const token = signToken(newUser._id);
        newUser.password = undefined;
        res.status(201).json(
            {
                status: "success",
                token,
                data:
                    {
                        user: newUser
                    }

            }
        )
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

    const token = signToken(user._id);
    res.status(200).json(
        {
            status: "success",
            token
        }
    )

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
        const user = await User.findById(payload.id);
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
    if (!email || !email.includes("@")) return next(new AppError(`email ${email} is incorrect`, 400));

    const user = await User.findOne({email});
    if (!user) return next(new AppError(`user with email ${email} not exists`, 404));
    const resetToken = await user.generatePasswordResetToken();
    try {
        await user.save({validateBeforeSave: false});
    } catch (error) {
        return next(error);
    }
    res.send(resetToken);

}

module.exports =
    {
        signUp,
        logIn,
        protect,
        authorize,
        forgotPassword
    };