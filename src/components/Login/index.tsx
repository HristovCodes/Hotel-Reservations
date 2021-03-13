import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Firebase from "../../firebase";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let history = useHistory();

  let logInUser = (e: any) => {
    e.preventDefault();
    Firebase.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        Firebase.auth.onAuthStateChanged(function (user: any) {
          if (user) {
            history.replace("/Hotel-Reservations");
          }
        });
      })
      .catch(function (error: any) {
        // Handle Errors here.
        console.log(error.message);
        history.replace("/Hotel-Reservations/Login");
      });
  };

  return (
    <div>
      <form onSubmit={logInUser}>
        <div>
          <label htmlFor="email">Имейл:</label>
          <input
            aria-required="true"
            type="email"
            name="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          <Link to="/Hotel-Reservations/ResetPassword">
            Забравих си паролата
          </Link>
        </div>
        <div>
          <label htmlFor="password">Парола:</label>
          <input
            aria-required="true"
            type="password"
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <button type="submit">Вход</button>
      </form>
    </div>
  );
}
