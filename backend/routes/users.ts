import * as express from 'express';

import validation from '../utils/validation';
import { UsersController } from '../controllers/users';
import { authMiddleware } from '../middleware/auth.middleware';
import errorMiddleware from '../middleware/errors.middleware';

const Joi = require('@hapi/joi');

const RouterUsers = {
    login: async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
			const schema = Joi.object({
				username: Joi.string().required(),
				password: Joi.string().required(),
			});

			await validation.validateParams(schema, req.body)

			const token = await UsersController.signin(req.body);
			res.send({ token });
		},
		
    create: async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
			// validate body
			const schema = Joi.object({
				first_name: Joi.string().required(),
				last_name: Joi.string().required(),
				username: Joi.string().required(),
				email: Joi.string().email().required(),
				password: Joi.string().required(),
				role: Joi.string().required()
			});
			await validation.validateParams(schema, req.body)

			// create account
			const result = await UsersController.create(req.body);
			res.status(201).send(result);
		},

		logout: async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
			const schema = Joi.object({
					email: Joi.string().email().required(),
			});

			await validation.validateParams(schema, req.body)
			await UsersController.signout(req.body.email);

			res.status(200).send('OK');
	},
}


const UserRoutes: express.Router = express.Router();
const authed = authMiddleware.authAssert({isActive: true, isVerified: true});

UserRoutes.post('/login', errorMiddleware(RouterUsers.login));
UserRoutes.post('/create', errorMiddleware(RouterUsers.create));
UserRoutes.post('/logout', errorMiddleware(authed), errorMiddleware(RouterUsers.logout));

export default UserRoutes;
