import React, { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Form, Fade } from 'react-bootstrap';

import ConfirmDelete from '../confirm/ConfirmDelete';
import UserContext from '../../context/userContext';
import { useAuth } from '../../context/authContext';

import { EditModal, Hr } from '../../styles/styledComponents';

const EditShift = (props) => {
	const [confirmDeleteState, setConfirmDeleteState] = useState(false);
	// eslint-disable-next-line
	const [userState, updateUser, jobState, setJobState, periodState, setPeriodState, viewPeriodState, setViewPeriodState,
		// eslint-disable-next-line
		shiftState, setShiftState, jobsState, setJobsState] = useContext(UserContext);
	const { authTokens, setAuthTokens } = useAuth();

	const toggleDeleteShift = () => {
		if (confirmDeleteState === true) {
			setConfirmDeleteState(false);
		} else {
			setConfirmDeleteState(true);
		}
	}

	const deleteShift = () => {
		fetch(
			"http://localhost:8080/wagetracker/" + userState.id + "/" + jobState.name + "/" + props.currentPeriod.dateName + "/" + shiftState.date,
			{
				method: 'DELETE',
				headers: {
					'Content-type': 'application/json',
					'Access-Control-Allow-Origin': 'localhost:3000/',
					'Access-Control-Allow-Methods': 'DELETE',
					Accept: 'application/json, text/plain, */*',
					authorization: authTokens
				}
			}
		).then(res => res.json()).then(res => {
			updateUser(res);
			props.history.push("/wagetracker");
		}).catch(e => {
			alert("Something went wrong attempting to contact the server.  Please try again later.  Logging you out.");
			localStorage.setItem("tokens", "");
			setAuthTokens("");
			window.location.reload();
		});
	}

	const submitChange = (event) => {
		const form = event.currentTarget;
		event.preventDefault();
		event.stopPropagation();

		let date = form.formBasicDate.value;
		let hours = form.formBasicHours.value;
		let ot = form.formBasicOvertime.value;

		date = date.replace("?", "").replace("/", "-");
		date = date.replace("/", "-");
		hours = Number.parseFloat(hours).toFixed(1);
		ot = Number.parseFloat(ot).toFixed(1);

		if (hours > 24) {
			alert('Are you sure you worked that many hours?')
		} else if (Date.parse(date) < Date.parse(props.currentPeriod.dateName) - 43200000) {
			alert('Shift date cannot be before start of pay period');
		} else if (Number.parseFloat(ot) > Number.parseFloat(hours)) {
			alert('Overtime can\'t exceed hours worked');
		} else if (hours.includes("-")) {
			alert('Hours cannot be negative');
		} else if (hours.includes("-")) {
			alert('Overtime cannot be negative');
		} else if (hours <= 0) {
			alert('Hours must be greater than 0')
		} else if (ot < 0) {
			alert('Overtime cannot be less than 0')
		} else {

			date = "0" + date.substring(6, 11);

			if (date === shiftState.date && hours === shiftState.hours && ot === shiftState.overtime) {
				props.history.push("/wagetracker");
			} else {
				fetch(
					"http://localhost:8080/wagetracker/" + userState.id + "/" + jobState.name + "/" + props.currentPeriod.dateName + "/" + shiftState.date,
					{
						method: 'PUT',
						headers: {
							'Content-type': 'application/json',
							Accept: 'application/json, text/plain, */*',
							authorization: authTokens
						},
						body: JSON.stringify({
							date: date,
							hours: hours,
							overtime: ot
						})
					}
				).then(res => res.json()).then(res => {
					updateUser(res);
					props.history.push("/wagetracker");
				}).catch(e => {
					alert("Something went wrong attempting to contact the server.  Please try again later.  Logging you out.");
					localStorage.setItem("tokens", "");
					setAuthTokens("");
					window.location.reload();
				});
			}
		}

	}

	return (
		<React.Fragment>
			<Fade appear in>
				<EditModal>
					{confirmDeleteState === false && <section>
						<Hr></Hr>
						<Form onSubmit={submitChange}>
							<Form.Label>Edit Date:</Form.Label>
							<Form.Group controlId="formBasicDate">
								<Form.Control type="date" required/>
							</Form.Group>
							<Form.Group controlId="formBasicHours">
								<Form.Control type="decimal" defaultValue={shiftState.hours} required />
							</Form.Group>
							<Form.Group controlId="formBasicOvertime">
								<Form.Control type="decimal" defaultValue={shiftState.overtime} />
							</Form.Group>
							<Button block variant="secondary" type="submit">Submit change</Button>
						</Form>
						<Hr></Hr>
						<Button block variant="secondary" onClick={() => toggleDeleteShift()}>Delete Shift</Button>
					</section>}
					{confirmDeleteState === true && <ConfirmDelete delete={() => deleteShift()} closeModal={() => toggleDeleteShift()} />}
				</EditModal>
			</Fade>
		</React.Fragment>
	);
}

export default withRouter(EditShift);