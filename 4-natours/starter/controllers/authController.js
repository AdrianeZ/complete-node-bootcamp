const User = require("../models/userModel");

async function signUp(req,res,next)
{
  try

  {
    const newUser = await User.create(req.body);
    res.status(201).json(
        {
          status: "success",
          data:
              {
                user:newUser
              }

        }
    )
  }
  catch(error)
  {
    next(error);
  }

}

module.exports =
    {
      signUp
    };