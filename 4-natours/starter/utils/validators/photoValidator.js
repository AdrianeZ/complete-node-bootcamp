const AppError = require("../AppError");

function photoValidator(val)
{
  if(typeof val !== "string" && typeof val !== "undefined") throw new AppError("Photo must be String", 400);
}

module.exports = photoValidator;