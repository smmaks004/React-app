
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function Login() {
	const [WhaToDo, setWhaToDo] = useState('Login');

	// Login form states
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	// Register form states
	const [regName, setRegName] = useState('');
	const [regSurname, setRegSurname] = useState('');
	const [regEmail, setRegEmail] = useState('');
	const [regPassword, setRegPassword] = useState('');
	const [regRepeatPassword, setRegRepeatPassword] = useState('');

	const [message, setMessage] = useState('');
	const [loggedIn, setLoggedIn] = useState(false);
	const [user, setUser] = useState(null);
	
    const navigate = useNavigate();

	// Check login status on mount
	useEffect(() => {
		const checkStatus = async () => {
			try {
				const res = await fetch('/api/auth/status', {
					credentials: 'include',
				});
				const statusData = await res.json();
				setLoggedIn(statusData.loggedIn);
				setUser(statusData.user || null);
			} catch (err) {
				setLoggedIn(false);
				setUser(null);
			}
		};
		checkStatus();
	}, []);

	const handleSubmitLogin = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ email, password }),
			});
			const responseData = await response.json();

			// setMessage('Login request sent!');
			setMessage(responseData.message || 'Login request sent!');
			
			if (response.ok) {
				setLoggedIn(true);
				setUser(responseData.data?.user || null);
                
				// Store token in localStorage for protected routes
				if (responseData.data?.token) {
					localStorage.setItem('token', responseData.data.token);
				}

				navigate('/');
			} else {
				setLoggedIn(false);
				setUser(null);
			}
		} catch (error) {
			setMessage('Error sending login request');
			setLoggedIn(false);
			setUser(null);
		}
	};

	const handleSubmitRegister = async (e) => {
		e.preventDefault();
		if (!regName || !regSurname || !regEmail || !regPassword || !regRepeatPassword) {
			setMessage('All fields are required');
			return;
		}
		if (regPassword !== regRepeatPassword) {
			setMessage('Passwords do not match');
			return;
		}
		try {
			const response = await fetch('/api/auth/registration', {

				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name: regName, surname: regSurname, email: regEmail, password: regPassword }),
			});
			const responseData = await response.json();
			if (response.ok) {
				setMessage('Registration successful! You can now log in.');
				// Optionally, switch to login form
				setWhaToDo('Login');
				// Clear registration fields
				setRegName('');
				setRegSurname('');
				setRegEmail('');
				setRegPassword('');
				setRegRepeatPassword('');
			} else {
				setMessage(responseData.message || 'Registration failed');
			}
		} catch (error) {
			setMessage('Error sending registration request');
		}
	};


	return (
		<div style={{ maxWidth: 300, margin: '100px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
			<h2 style={{ color: 'black' }}>{WhaToDo === 'Login' ? 'Login' : 'Register'}</h2>

			{WhaToDo === 'Login' ? (
				<form onSubmit={handleSubmitLogin}>
					<div style={{ marginBottom: 10 }}>
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							style={{ width: '100%', padding: 8 }}
							required
						/>
					</div>
					<div style={{ marginBottom: 10 }}>
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							style={{ width: '100%', padding: 8 }}
							required
						/>
					</div>
					<button type="submit" style={{ width: '100%', padding: 8 }}>Login</button>
				</form>
			) : (
				<form onSubmit={handleSubmitRegister}>
					<div style={{ marginBottom: 10 }}>
						<input
							type="text"
							placeholder="Name"
							value={regName}
							onChange={e => setRegName(e.target.value)}
							style={{ width: '100%', padding: 8 }}
							required
						/>
					</div>
					<div style={{ marginBottom: 10 }}>
						<input
							type="text"
							placeholder="Surname"
							value={regSurname}
							onChange={e => setRegSurname(e.target.value)}
							style={{ width: '100%', padding: 8 }}
							required
						/>
					</div>
					<div style={{ marginBottom: 10 }}>
						<input
							type="email"
							placeholder="Email"
							value={regEmail}
							onChange={e => setRegEmail(e.target.value)}
							style={{ width: '100%', padding: 8 }}
							required
						/>
					</div>
					<div style={{ marginBottom: 10 }}>
						<input
							type="password"
							placeholder="Password"
							value={regPassword}
							onChange={e => setRegPassword(e.target.value)}
							style={{ width: '100%', padding: 8 }}
							required
						/>
					</div>
					<div style={{ marginBottom: 10 }}>
						<input
							type="password"
							placeholder="Repeat Password"
							value={regRepeatPassword}
							onChange={e => setRegRepeatPassword(e.target.value)}
							style={{ width: '100%', padding: 8 }}
							required
						/>
					</div>
					<button type="submit" style={{ width: '100%', padding: 8 }}>Register</button>
				</form>
			)}

			<button
				type="button"
				onClick={() => {
					setMessage('');
					setWhaToDo(WhaToDo === 'Login' ? 'Register' : 'Login');
				}}
			>
				{WhaToDo === 'Login' ? 'Register?' : 'Login?'}
			</button>

			{message && <div style={{ marginTop: 10 }}>{message}</div>}
		</div>
	);
}

export default Login;
