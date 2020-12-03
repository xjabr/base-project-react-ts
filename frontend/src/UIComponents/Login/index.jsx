import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '../../Context/auth-context';

const Login = () => {
	const { setToken, login } = useAuth();
	const [error, setError] = useState(null);
	// const [isForgot, setIsForgot] = useState(null);

	const {
		register,
		handleSubmit,
		errors,
		formState: { isValid },
	} = useForm({ mode: 'onChange' });

	const onSubmit = async (data) => {
		try {
			const result = await login({
				username: data.username,
				password: data.password,
			});

			const { token } = result.data;
			setToken(token);
		} catch (err) {
			const { data } = err.response;
			setError(data.error.description);
		}
	}

	return (
		<>
			<div>
				<h1>Welcome back to ClinicSoul</h1>
				<form onSubmit={handleSubmit(onSubmit)} className={'form-login'}>
					{error && <div>There was an error logging you in. {error}</div>}
					<div className="form-field login-form">
						<label className={'oval-circle-red oval--right'} htmlFor="email">
							Username
													</label>
						<input name="username" ref={register({ required: true })} />
						{/* errors will return when field validation fails  */}
						{errors.email && <span className={'error-validation'}>This field is required</span>}
					</div>
					<div className="form-field">
						<label className={'oval-circle-red oval--right'} htmlFor="password">
							Password
													</label>
						<input type="password" name="password" ref={register({ required: true })} />
						{errors.password && <span className={'error-validation'}>This field is required</span>}
					</div>
					<button type="submit" className={`btn btn-md btn-magenta ${!isValid ? 'btn-invalid' : ''}`}>
						Log in
					</button>
				</form>
			</div>
		</>
	)
}

export default Login;