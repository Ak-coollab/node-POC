const  Joi = require('joi') ;

const joi = {}; 

studentRegisterationSchema = Joi.object({
    name: Joi.string().max(256).required(),
    username: Joi.string().max(256).required(),
    password: Joi.string().min(8).max(12).required(),
    email: Joi.string().email().max(256).required(),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required(),
    roles: Joi.required(),
    image: Joi.string(),
    base64Content: Joi.string().allow(null, ''),
    classId : Joi.number().integer().required(),
    sectionId : Joi.number().integer().required(),
});

adminRegisterationSchema = Joi.object({
  name: Joi.string().max(256).required(),
  username: Joi.string().max(256).required(),
  password: Joi.string().min(8).max(12).required(),
  email: Joi.string().email().max(256).required(),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required(),
  roles: Joi.required(),
});

studentDetailsUpdateSchema = Joi.object({
  name: Joi.string().max(256).required(),
  username: Joi.string().max(256).required(),
  password: Joi.string().min(8).max(12).required(),
  email: Joi.string().email().max(256).required(),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required()
});

joi.studentRegisterationSchema = studentRegisterationSchema;
joi.adminRegisterationSchema = adminRegisterationSchema;
joi.studentDetailsUpdateSchema = studentDetailsUpdateSchema;

module.exports = joi;