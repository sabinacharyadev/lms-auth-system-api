import Joi from "joi";
import { buildErrorResponse } from "../utility/responseHelper.js";

export const newBookValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      author: Joi.string().required(),
      isbn: Joi.number().required(),
      publish_year: Joi.string().required(),
      description: Joi.string().max(5000).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      buildErrorResponse(res, error.message);
      return;
    }

    next();
  } catch (error) {
    buildErrorResponse(res, "Validation Failed");
  }
};
