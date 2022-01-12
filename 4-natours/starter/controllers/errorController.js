const AppError = require("../utils/AppError");

function sendErrorResponse(err, res)
{
  res.status(err.statusCode ?? 500).json(
      {
        status: err.status ?? "error",
        message: err.message ?? "Something went Wrong"
      }
  );
}

function errorHandler(err, req, res, next)
{
  console.log(err);
  if (err instanceof AppError)
  {
    sendErrorResponse(err, res);
  }
  else
  {
    if (err.name === "CastError") // Wrong request id Error(Not included in Validation Error)
    {
      const message = `Invalid ${err.path}: ${err.value}.`;
      sendErrorResponse(new AppError(message, 400), res);
    }
    else if (err.code === 11000) //Duplicate name Error (Not included in Validation Error)
    {
      let message = "";
      const duplicates = Object.entries(err.keyValue);
      duplicates.forEach(([field, value]) => {
        message += `${field} with value ${value} already exists`;
      })

      sendErrorResponse(new AppError(message, 400), res);
    }
    else if (err.name === "ValidationError")
    {
      let message = "";
      for (const error in err.errors)
      {
        message += err.errors[error].message + " "; //TODO
      }
      sendErrorResponse(new AppError(message, 400), res);
    }

    else if (err.name === "JsonWebTokenError")
    {
      sendErrorResponse(new AppError("Invalid Token please log in again", 401), res);
    }

    else if(err.name === "TokenExpiredError")
    {
      sendErrorResponse(new AppError("Token has expired please log in again", 401), res);
    }


    else
    {
      sendErrorResponse(new AppError("Something went Wrong"), res);
    }
  }
}

module.exports =
    {
      errorHandler
    };