import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import Homepage from './components/Homepage/Homepage'
import RouteSelection from './components/RouteSelection/RouteSelection'
import LogOrsign from './components/Login-Signup/LogOrsign'
import Signup from './components/Login-Signup/Signup'
import Profile from './components/Profile/Profile'
import TicketPage from './components/TicketPage/TicketPage'
import './App.css';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            sessionStorage.getItem('authToken')
                ? <Component {...props} />
                : <Redirect to="/login" />
        }
    />
)

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/" exact render={props => <Homepage {...props} />} />
                    <Route path="/login" render={props => <LogOrsign {...props} />} />
                    <Route path="/register" render={props => <Signup {...props} />} />
                    <PrivateRoute path="/routes" exact component={RouteSelection} />
                    <PrivateRoute path="/profile" exact component={Profile} />
                    <PrivateRoute path="/getTicket" exact component={TicketPage} />
                    <Redirect to="/" />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
