import Joi from "joi";

const STR = Joi.string();
const STR_REQUIRED = STR.required();
const PHONE = STR.allow("", null);
const EMAIL = STR.email({ minDomainSegments: 2 });
const ISTRUE = Joi.boolean().allow(null);
const NUM_REQ = Joi.number();

const joiValidator = ({ req, res, next, schema }) => {
  try {
    const { error } = schema.validate(req.body || {});
    error
      ? res.json({
          status: "error",
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};

export const newUserValidation = (req, res, next) => {
  const schema = Joi.object({
    fName: STR_REQUIRED,
    lName: STR_REQUIRED,
    phone: PHONE,
    email: EMAIL.required(),
    password: STR_REQUIRED,
  });
  return joiValidator({ req, res, next, schema });
};

export const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: EMAIL.required(),
    password: STR_REQUIRED,
  });
  return joiValidator({ req, res, next, schema });
};

// creating a book
export const newBookValidation = (req, res, next) => {
  const schema = Joi.object({
    title: STR_REQUIRED,
    author: STR_REQUIRED,
    isbn: STR_REQUIRED,
    publishedYear: NUM_REQ,
    thumbnail: STR.allow(null),
    description: STR_REQUIRED,
    file: Joi.object(),
    price: Joi.number(),
  });
  return joiValidator({ req, res, next, schema });
};

// update book validation
export const updateBookValidation = (req, res, next) => {
  const schema = Joi.object({
    title: STR,
    author: STR,
    publishedYear: Joi.number(),
    thumbnail: STR,
    description: STR,
    status: STR.valid("active", "inactive"),
    price: Joi.number(),
  });
  return joiValidator({ req, res, next, schema });
};

// create review validation
export const createReviewValidation = (req, res, next) => {
  const schema = Joi.object({
    title: STR_REQUIRED,
    description: STR_REQUIRED,
    rating: Joi.number().required(),
  });
  return joiValidator({ req, res, next, schema });
};

// update review validation
export const updateReviewValidation = (req, res, next) => {
  const schema = Joi.object({
    status: STR_REQUIRED.valid("active", "inactive"),
  });
  return joiValidator({ req, res, next, schema });
};
