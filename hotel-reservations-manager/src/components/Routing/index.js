import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import firebase from "../../firebase.js";
import User from "../User/index";
import Client from "../Client/index";
import Room from "../Room/index";
import Reservation from "../Reservation/index";
import NoMatch from "../NoMatch/index";
import Login from "../Login/index";
import Main from "../Main/index";

export default function Routing() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        setUser(user);
      }
    });
  });

  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <Redirect to="/Hotel-Reservations/"></Redirect>
          </Route>
          <PrivateRoute user={user} exact path="/Hotel-Reservations/">
            <Main></Main>
          </PrivateRoute>
          <PrivateRoute user={user} path="/Hotel-Reservations/User">
            <User></User>
          </PrivateRoute>
          <PrivateRoute user={user} path="/Hotel-Reservations/Client">
            <Client></Client>
          </PrivateRoute>
          <PrivateRoute user={user} path="/Hotel-Reservations/Room">
            <Room></Room>
          </PrivateRoute>
          <PrivateRoute user={user} path="/Hotel-Reservations/Reservation">
            <Reservation></Reservation>
          </PrivateRoute>
          <Route path="/Hotel-Reservations/Login">
            <Login></Login>
          </Route>
          <Route path="*">
            <NoMatch></NoMatch>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function PrivateRoute({ user, children, ...rest }) {
  return (
    <Route {...rest}>
      {user ? children : <Redirect to={"/Hotel-Reservations/Login"}></Redirect>}
    </Route>
  );
}
