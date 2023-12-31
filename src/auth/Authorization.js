import React from 'react';
import { Button, Form, Card } from 'react-bootstrap';

import { useAuth } from '../context/authContext';

import { LoginPage, AppTitle, LoginButtonContainer } from '../styles/styledComponents';

const Authorization = (props) => {
	// eslint-disable-next-line
	const [loggedIn, setLoggedIn] = React.useState(false);
	const [isError, setIsError] = React.useState(false);
	const { setAuthTokens } = useAuth();

	const login = (event) => {
		const form = event.currentTarget;
		event.preventDefault();
		event.stopPropagation();

		let user = form.formBasicUsername.value;

		let password = form.formBasicPassword.value;

		const token = 'Basic ' + user.toLowerCase() + ":" + password;

		fetch(
			"http://localhost:8080/wagetrak-login",
			{
				method: 'POST',
				headers: {
					Accept: 'application/json, text/plain, */*',
					Authorization: token
				},
				body: {}
			}).then(res => {
				if (res.status === 200) {
					res.json()
					.then(res => {
					setAuthTokens(res.token)
					props.setUserId(res.UserId);
					setLoggedIn(true)
					props.setAuthorized(true);
					});
				} else if (res.status === 204){
					alert("User with that username does not exist");
				} else if (res.status === 406) {
					alert("Password is incorrect");
				} else {
					setIsError(true);
					setLoggedIn(false);
					props.setAuthorized(false);
				}
			}).catch(e => {
				alert("Failed to reach the server.  Please try again later");
				setLoggedIn(false)
				props.setAuthorized(false);
			});

	}

	// if (loggedIn === true) {
	// 	props.setAuthorized(true);
	// }

	if(isError) {
		alert("Something went wrong.  Try again later.  If the problem persists please contact us");
	}

	return (
		<LoginPage>
			<AppTitle>wagetracker</AppTitle>
			<section style={{ margin: '20vh 4vw' }}>
				<Card border="info">
					<Card.Header>
						<p style={{ color: 'teal' }}>Login</p>
					</Card.Header>
					<Form onSubmit={login}>
						<section stye={{ margin: 'auto 10px' }}>
						<Form.Group controlId="formBasicUsername">
							<Form.Control type="text" placeholder="User name" required autofocus="autofocus"></Form.Control>
						</Form.Group>
						<Form.Group controlId="formBasicPassword">
							<Form.Control type="password" placeholder="Password" required />
						</Form.Group>
						<LoginButtonContainer>
							<Button variant="info" type="submit">
								Login
						</Button>{"  "}
							<Button onClick={() => props.register(true)} variant="outline-info">
								Register new user
						</Button>
						</LoginButtonContainer>
						</section>
					</Form>
					<Card.Footer>

					</Card.Footer>
				</Card>
			</section>
		</LoginPage>
	);
}

export default Authorization;