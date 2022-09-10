import * as Joi from '@hapi/joi';
import { join } from 'path';

export const configValidationSchema = Joi.object({
  STAGE: Joi.string().required(),
  HOST: Joi.string().required(),
  PORT: Joi.number().default(3000),
  DB_PORT: Joi.number().default(3306).required(),
  USERNAME: Joi.string().required(),
  PASSWORD: Joi.string().required(),
  DATABASE: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
