import React, { useEffect, useState, useCallback } from 'react';
import { withRouter, Route, Redirect } from 'react-router-dom';

import User from './user/User';
import Job from './jobs/job/Job';
import Navbar from '../navigation/Navbar';
import PayPeriods from './payPeriods/PayPeriods';
import PayPeriod from './payPeriods/payPeriod/PayPeriod';
import Shift from './shifts/shift/Shift';
import AddJob from './addjob/addJob';
import AddPeriod from './addPeriod/addPeriod';
import AddShift from './addShift/addShift';
import Loading from '../styles/Loading';
import UserContext from '../context/userContext';
import ToggleContext from '../context/toggleContext';
import { useAuth } from '../context/authContext';

import Logout from '../modals/logout/logout';
import NavMenu from '../modals/menu/NavMenu';
import ReportBug from '../modals/reportBug/ReportBug';

import './WageTrak.css';

const Wagetracker = (props) => {
	const [userState, setUserState] = useState({});
	const [jobState, setJobState] = useState({});
	const [periodState, setPeriodState] = useState({});
	const [viewPeriodState, setViewPeriodState] = useState({});
	const [shiftState, setShiftState] = useState({});
	const [jobsState, setJobsState] = useState({});
	const { authTokens, setAuthTokens } = useAuth();

	const [logout, setLogout] = useState(false);
	const [navMenu, setNavMenu] = useState(false);
	const [report, setReport] = useState(false);

	const contextArr = [userState, setUserState, jobState, setJobState, periodState, setPeriodState, viewPeriodState, setViewPeriodState,
		shiftState, setShiftState, jobsState, setJobsState];

	const toggleArr = [ setLogout, setNavMenu, setReport ];

	const getUser = useCallback( () => {
		fetch(
			"http://localhost:8080/wagetrak/users/" + props.userId,
			{
				method: 'GET',
				headers: {
					Accept: 'application/json, text/plain, */*',
					Authorization: authTokens
				}
			}
		).then(res => res.json())
			.then(res => {
				console.log(res);
				setUserState(res);
				//this exists simply to force a re-render when jobs is changed
				setJobsState(res.jobs);
			}).catch(e => {
				alert("Something went wrong attempting to contact the server.  Please try again later.  Logging you out.");
				localStorage.setItem("tokens", "");
				setAuthTokens("");
				window.location.reload();
			});
		// setUserState(userState);
	}, [authTokens, setUserState, setJobsState, props.userId, setAuthTokens])

	useEffect(() => {
		getUser();
	}, [getUser]);

	const toggleLogout = () => {
		if (window.location.pathname !== "/wagetracker") {
			props.history.push("/wagetracker");
		}
		if (!logout) {
			if (navMenu) {
				setNavMenu(false);
			}
			setLogout(true);
		} else {
			setLogout(false);
		}
	}

	const toggleMenu = () => {
		if (window.location.pathname !== "/wagetracker") {
			props.history.push("/wagetracker");
		}
		if (!navMenu && report) {
			if (logout) {
				setLogout(false);
			}
			setReport(false);
			setNavMenu(false);
		} else if (!navMenu) {
			if (logout) {
				setLogout(false);
			}
			setNavMenu(true);
		} else {
			setNavMenu(false);
		}
	}

	const toggleReport = () => {
		if (window.location.pathname !== "/wagetracker") {
			props.history.push("/wagetracker");
		}
		if (!report) {
			setNavMenu(false);
			setReport(true);
		} else {
			setReport(false);
		}
	}

	const goBack = () => {
		if (window.location.pathname !== "/wagetracker") {
			props.history.push("/wagetracker");
		}
		if (window.location.pathname !== "/wagetracker") {
			window.history.back();
		} else if (window.location.pathname === "/wagetracker") {
			toggleLogout();
		}
	}

	//spinner
	let userData = <Loading />;

	if (userState) {
		userData = <User />
	}

	return (
		<React.Fragment>
			<ToggleContext.Provider value={[...toggleArr]}>
				<UserContext.Provider value={[...contextArr]}>
					<Navbar getUser={() => getUser()} toggleLogout={toggleLogout} toggleMenu={toggleMenu} toggleReportBug={toggleReport} goBack={goBack} />
					{window.location.pathname === "/" || window.location.pathname === "/wagetracker/wagetracker/job" ? <Redirect to="/wagetracker" /> : null}
					<Route
						path="/wagetracker/"
						render={() => userData}
					/>
					<Route
						path="/wagetracker/job"
						render={() => <Job />}
					/>
					<Route
						path="/wagetracker/job/periods"
						render={() => <PayPeriods />}
					/>
					<Route
						path="/wagetracker/job/periods/period"
						render={() => <PayPeriod
							currentPeriod={periodState}
						/>}
					/>
					<Route
						path="/wagetracker/job/periods/viewPeriod"
						render={() => <PayPeriod
							currentPeriod={viewPeriodState}
						/>}
					/>
					<Route
						path="/wagetracker/job/periods/period/shift"
						render={() => <Shift
							currentPeriod={periodState}
						/>}
					/>
					<Route
						path="/wagetracker/job/periods/viewPeriod/shift"
						render={() => <Shift
							currentPeriod={viewPeriodState}
						/>}
					/>
					<Route
						path="/wagetracker/add-job"
						render={() => <AddJob />}
					/>
					<Route
						path="/wagetracker/add-period"
						render={() => <AddPeriod />}
					/>
					<Route
						path="/wagetracker/add-shift"
						render={() => <AddShift
							currentPeriod={periodState}
						/>}
					/>
					<Route
						path="/wagetracker/view-period/add-shift"
						render={() => <AddShift
							currentPeriod={viewPeriodState}
						/>}
					/>
					{logout && !navMenu && !report && <Logout />}
					{navMenu && !logout && !report && <NavMenu getUser={() => getUser()} toggleMenu={() => toggleMenu()} toggleReport={() => toggleReport()} toggleLogout={() => toggleLogout()}/>}
					{report && !navMenu && !logout && <ReportBug toggleReport={() => toggleReport()} />}
				</UserContext.Provider>
			</ToggleContext.Provider>
		</React.Fragment>
	);
}

export default withRouter(Wagetracker);