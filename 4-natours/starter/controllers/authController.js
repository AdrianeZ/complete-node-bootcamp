const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

function signToken(id)
{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

async function signUp(req, res, next)
{
    try {

        const {name, email, password, passwordConfirm} = req.body;
        const newUser = await User.create(
            {
                name,
                email,
                password,
                passwordConfirm
            }
        );

            const token = signToken(newUser._id);

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
    let {email, password} = req.body;

    if (!email || !password) {
        return next(new AppError("Please Provide Correct Credentials", 400));
    }

    const user = await User.findOne({email}).select("+password");
    const isCorrectPassword = await user?.correctPassword(password);

    if(!user || !isCorrectPassword)
    {
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

module.exports =
    {
        signUp,
        logIn
    };