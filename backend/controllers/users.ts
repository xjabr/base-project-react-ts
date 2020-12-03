import * as jwt from 'jsonwebtoken';

import UserColl from '../models/user';
import { JWTtoken } from '../types/JWTtoken';
import { JWT_SECRETS } from '../configuration';

import { assertExposable } from '../modules/errors';

const signToken = (user): JWTtoken => {
  return jwt.sign(
    {
      id: user._id,
			email: user.email,
			username: user.username,
      isActive: user.isActive,
      isVerified: user.isVerified,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 14), // Expires in 14 days
    },
    JWT_SECRETS,
  );
};

export const UsersController = {
  signin: async (body) => {
    const { username, password } = body;

    const user = await UserColl.findOne({ username });

    assertExposable(user, 'login_fail');
    assertExposable(user.isActive, 'disabled_account');
    // assertExposable(user.isVerified, 'user_not_verified');

    const pwd = await user.isCorrectPassword(password);

    assertExposable(pwd, 'login_fail');

    const token = signToken(user);
    return token;
	},

	create: async (body) =>{
		const { email, username } = body;

		const exists = await UserColl.exists({ email, username})
		assertExposable(!exists, 'already_exists');

		const newUser = new UserColl(body);
		const result = newUser.save();
		return result;
	},
	
  signout: async (email) => {
    const user = await UserColl.findOne({ email });
    assertExposable(user, 'user_not_exists');
    return user;
  }
}