import { throwExposable } from '../modules/errors';
const Joi = require('@hapi/joi');

const validation = {
  Joi,
  joiUuid : Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  joiMobilePrefix : Joi.string().regex(/^[+][0-9]*$/), //with prefix
  joiMobile : Joi.string().regex(/^[+0-9]*$/),
  joiPassword : Joi.string().length(64),
  uuid: new RegExp("^[0-9a-fA-F]{24}$"),

  async validateParams(schema, params){
    try {
      const res = await schema.validateAsync(params, { presence: 'required' });
      return res;
    } catch (error) {
      const validationError = {
        params,
        errors: error.details.map(detail => detail.message),
      };

      if (validationError.params.password) {
        delete validationError.params.password;
      }

      throwExposable('bad_params', null, null, {
        validationError,
      });
    }
  },
};

export default validation;