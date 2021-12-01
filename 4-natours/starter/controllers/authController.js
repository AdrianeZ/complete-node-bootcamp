const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

async function signUp(req, res, next)
{
  try
  {

    const {name, email, password, passwordConfirm} = req.body;
    const newUser = await User.create(
        {
          name,
          email,
          password,
          passwordConfirm
        }
    );

    const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    })

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
  }
  catch (error)
  {
    next(error);
  }

}

async function logIn(req, res, next)
{
  const {email, password} = req.body;

  if (!email || !password)
  {
    //TODO
  }

  const user = User.findOne({email, password});

  const token = "";
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