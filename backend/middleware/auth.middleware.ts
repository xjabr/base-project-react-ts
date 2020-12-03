import * as express from 'express';
import * as jwt from 'jsonwebtoken';

import { JWT_SECRETS } from '../configuration';
import { assertExposable, throwExposable } from '../modules/errors';
import UserColl from '../models/user';

export const authMiddleware = {
  authAssert: (opts: any = {}) => async (
    req: express.Request,
    res: express.Response | any,
    next: express.NextFunction,
  ) => {
    const bearerHeader = req.headers['authorization'];

    assertExposable(bearerHeader, 'token_not_found');

    const bearer = bearerHeader.split(' ')[1];
    assertExposable(!!bearer, 'token_not_found');
    try {
      await jwt.verify(bearer, JWT_SECRETS);
    } catch (e) {
      throwExposable('access_denied');
    }

    const { email } = jwt.decode(bearer) as any;

    const user = await UserColl.findOne({ email });
    assertExposable(user, 'access_denied');
    assertExposable((opts.isActive && user.isActive), 'disabled_account');

    res.user = user;

    next();
  }
};