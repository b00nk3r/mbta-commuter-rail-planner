function validateWith(validatorFn) {
    return (req, res, next) => {
      const { error, data } = validatorFn(req.body);
      if (error) return res.status(400).send({ message: error.errors[0].message });
      req.validatedBody = data;
      next();
    };
  }
  module.exports = { validateWith };