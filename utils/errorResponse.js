function validationErrors(res, errors, errcode, statusCode, status) {
  const newErrors = [];
  for (const error_prop in errors) {
    const err = {
      param: error_prop,
      message: errors[error_prop][0],
      code: errcode,
    };
    newErrors.push(err);
  }
  res.status(statusCode).json({ status: status, errors: newErrors });
}

module.exports = { validationErrors };
