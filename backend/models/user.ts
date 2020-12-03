import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

import { IUserModel, rolesEnum } from '../types/users';

export interface IUser extends IUserModel, mongoose.Document {
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	password: string;
	role: rolesEnum;
	isCorrectPassword?(password: string): void;
	isVerified: boolean;
	isActive: true;
}

const saltRounds = 10;

// TODO: VALIDATION
const UserSchema: mongoose.Schema = new mongoose.Schema({
	first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	username: { type: String, required: true },
	email: {
		type: String,
		lowercase: true,
		required: [true, 'User email required'],
	},
	password: { type: String, required: true, select: true },
	role: { type: String, required: true, enum: ['ADMIN', 'STAFF', 'CLIENT'] },
	isActive: { type: Boolean, default: true },
	isVerified: { type: Boolean, default: false },
	divisions: { type: Array, required: false, default: ['all'] }
});

UserSchema.pre<IUser>('save', function (next) {
	// Check if document is new or a new password has been set
	if (this.isNew || this.isModified('password')) {
		// Saving reference to this because of changing scopes
		const document = this;
		bcrypt.hash(document.password, saltRounds, function (err, hashedPassword) {
			if (err) {
				next(err);
			} else {
				document.password = hashedPassword;
				next();
			}
		});
	} else {
		next();
	}
});

UserSchema.methods = {
	isCorrectPassword: async function (password) {
		return bcrypt.compare(password, this.password);
	},
}

// Export the model and return your IUser interface
const UserColl = mongoose.model<IUser>('user', UserSchema);
export default UserColl;