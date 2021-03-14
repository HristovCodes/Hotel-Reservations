import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import firebase from "../../firebase.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let history = useHistory();

  const loginUser = (e) => {
    e.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            history.replace("/Hotel-Reservations/");
          }
        });
      })
      .catch((e) => {
        console.log(e.code);
        console.log(e.message);
      });
  };

  return (
    <div>
      <h1>Hotel Reservations</h1>
      <h2>Моля влезте във вашият акаунт</h2>
      <form onSubmit={loginUser}>
        <input
          onChange={(e) => setEmail(e.target.value)}
          required={true}
          type="email"
          placeholder="examplemail@provider.com"
        ></input>
        <input
          onChange={(e) => setPassword(e.target.value)}
          required={true}
          placeholder="password"
          type="password"
        ></input>
        <div>
          <button type="button">
            <img></img>
          </button>
          <p>Запомни ме</p>
        </div>
        <button type="submit">Вход</button>
      </form>
    </div>
  );
}
