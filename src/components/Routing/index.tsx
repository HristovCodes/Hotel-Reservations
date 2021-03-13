import React, { useContext, createContext, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";
import firebase from "../../firebase.js";

export default function Routing() {
  return (
    <Router>
      <div>
        {
          // The ul is the visible part.
        }
        <ul>
          <li>
            <Link to="/Hotel-Reservations/User">Users Database</Link>
          </li>
          <li>
            <Link to="/Hotel-Reservations/Client">Clients Database</Link>
          </li>
          <li>
            <Link to="/Hotel-Reservations/Room">Rooms Database</Link>
          </li>
          <li>
            <Link to="/Hotel-Reservations/Reservation">
              Reservations Database
            </Link>
          </li>
        </ul>
      </div>
    </Router>
  );
}

interface PrivateRouteInterface {
  children: any;
}

function PrivateRoute({ children, ...rest }: PrivateRouteInterface) {
  let user = firebase.auth.currentuser;
  return (
    <Route {...rest}>
      {user ? children : <Redirect to={"/Hotel-Reservations/Login"}></Redirect>}
    </Route>
  );
}
