import React from "react";
import { Link } from "react-router-dom";

export default function Main() {
  return (
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
        <Link to="/Hotel-Reservations/Reservation">Reservations Database</Link>
      </li>
    </ul>
  );
}
