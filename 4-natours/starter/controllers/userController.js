const User = require("../models/userModel");

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
    }
    catch (error)
    {
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
        deleteUser
    };