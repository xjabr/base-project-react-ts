export interface IUserModel {
  organization_id: string
  email: string;
  password: string;
  role: rolesEnum;
  isVerified: boolean;
  isActive: boolean;
}

export enum rolesEnum {
	ADMIN = 'ADMIN',
	STAFF = 'STAFF',
	CLIENT = 'CLIENT'
}