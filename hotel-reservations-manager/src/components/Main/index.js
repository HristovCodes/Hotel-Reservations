import React from "react";
import { Link } from "react-router-dom";
import firebaseInstance from "../../firebase";
import "./styles.scss";

export default function Main() {
  return (
    <div className="main">
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
      <button
        className="btn"
        onClick={() => {
          firebaseInstance.auth().signOut();
        }}
        type="button"
      >
        Log Out
      </button>
    </div>
  );
}
