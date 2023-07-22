import React, { useContext, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';

import UserContext from '../../context/userContext';
import ToggleContext from '../../context/toggleContext';
import { useAuth } from '../../context/authContext';

import Loading from '../../styles/Loading';

const ReportBug = (props) => {
	const [userState] = useContext(UserContext);
	// eslint-disable-next-line
	const [ setLogout, setNavMenu, toggleReport ] = useContext(ToggleContext);
	const { authTokens, setAuthTokens } = useAuth();
	const [ reportState, setReport ] = useState(false);

	const submit = (event) => {
		setReport(true);
		const form = event.currentTarget;
		event.preventDefault();
		event.stopPropagation();

		let text = form.formBasicReport.value;

		if (!text) {
			props.toggleReport();
		} else if (text === '' || text === ' ') {
			props.toggleReport();
		} else {

			fetch(
				"http://localhost:8080/wagetracker/bugs",
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: authTokens
					},
					mode: 'cors',
					body: JSON.stringify({
						userId: userState.id,
						text: text
					})
				}
			).then(res => {
				if (res.status === 200) {
					setTimeout(() => props.toggleReport(), 800);
					setTimeout(() => alert("Report submitted"), 900);
				} else {
					alert("Error submitting bug report");
				}
				
			}).catch(e => {
			alert("Something went wrong attempting to contact the server.  Please try again later.  Logging you out.");
			localStorage.setItem("tokens", "");
			setAuthTokens("");
			window.location.reload();
		})
		}
	}

	return (
		<Modal.Dialog>
			<Modal.Header closeButton onClick={() => toggleReport(false)}>Bug report</Modal.Header>
			<Modal.Body>
				{!reportState && <Form onSubmit={submit}>
					<Form.Group controlId="formBasicReport">
						<Form.Control type="text" placeholder="Tell us what's wrong" />
					</Form.Group>
					<Button block size="sm" variant="secondary" type="submit">Submit</Button>
				</Form>}
				{reportState && <Loading />}
			</Modal.Body>
		</Modal.Dialog>
	);
}

export default withRouter(ReportBug);