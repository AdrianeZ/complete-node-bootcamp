const User = require("../models/userModel");
const AppError = require("../utils/AppError");

async function updateMe(req, res, next)
{
    if (req.body.password || req.body.passwordConfirm) return next(new AppError("This route is not for password updates (please" +
        " use /updatePassword)", 400));

    const dataToUpdate = {};
    for (const [key, value] of Object.entries(req.body)) {
        if ((key === "email" || key === "name") && value) dataToUpdate[key] = value;
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.loggedUser.id, dataToUpdate, {
            new: true, runValidators: true
        })
        res.json({
            status: "success",
            updatedUser

        });
    } catch (error) {
        return next(error);
    }
}

async function deleteMe(req, res, next)
{
    await User.findByIdAndUpdate(req.loggedUser.id, {active: false}, {runValidators: true, new: true});
    res.status(204).json({
        status: "success",
        data: null
    })
}

async function getAllUsers(req, res, next)
{
    try {
        const users = await User.find();

        res.json(
            {
                status: "success",
                results: users.length,
                data: {
                    users
                }
            }
        )
    } catch (error) {
        next(error);
    }
}

function getUser(req, res)
{
    res.status(500).json({status: "error", message: "route is not implemented yet"});
}

function addUser(req, res)
{
    res.status(500).json({status: "error", message: "route is not implemented yet"});
}

function updateUser(req, res)
{
    res.status(500).json({status: "error", message: "route is not implemented yet"});
}

function deleteUser(req, res)
{
    res.status(500).json({status: "error", message: "route is not implemented yet"});
}

module.exports =
    {
        getAllUsers,
        getUser,
        addUser,
        updateUser,
        deleteUser,
        updateMe,
        deleteMe
    };