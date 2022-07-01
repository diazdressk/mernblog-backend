import validator from 'express-validator';
const { validationResult } = validator;

export default (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400 /* 400 неверный запрос */).json(errors.array());
  }

  next();
};
