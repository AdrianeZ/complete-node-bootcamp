function emailValidator(email)
{
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return regex.test(email);
}

module.exports = emailValidator;