import React, { useEffect, useState } from "react";
import firebase from "../../firebase";

export default function User() {
  const [users, setUsers] = useState();
  const [id, setID] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [dateEmployed, setDateEmployed] = useState("");
  const [active, setActive] = useState(false);
  const [releaseDate, setReleaseDate] = useState(null);

  // takes care of the initial call to the db to get all the users
  const pullUsers = () => {
    firebase
      .getUser("id")
      .then((u) => {
        setUsers(u);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    if (!users) pullUsers();
  });

  const addUser = (e) => {
    e.target.reset();
    firebase.setUser(
      id,
      username,
      firstName,
      middleName,
      lastName,
      phoneNumber,
      email,
      dateEmployed,
      active,
      releaseDate
    );
  };

  const formatUser = (user) => {
    return user ? (
      <li key={user.id}>
        <hr></hr>
        <p>{user.id}</p>
        <p>{user.username}</p>
        <p>{user.firstname}</p>
        <p>{user.middlename}</p>
        <p>{user.lastname}</p>
        <p>{user.phonenumber}</p>
        <p>{user.email}</p>
        <p>{user.dateemployed}</p>
        <p>{user.active.toString()}</p>
        <p>{user.releasedate}</p>
        <hr></hr>
      </li>
    ) : (
      ""
    );
  };

  return (
    <div>
      <h2>Add users:</h2>
      <form onSubmit={addUser}>
        <label htmlFor="id">ЕГН:</label>
        <input
          onChange={(e) => {
            setID(e.target.value);
          }}
          name="id"
          type="text"
        ></input>
        <label htmlFor="username">Потребителско име:</label>
        <input
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          name="username"
          type="text"
        ></input>
        <label htmlFor="firstName">Име:</label>
        <input
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
          name="firstName"
          type="text"
        ></input>
        <label htmlFor="middleName">Бащино име:</label>
        <input
          onChange={(e) => {
            setMiddleName(e.target.value);
          }}
          name="middleName"
          type="text"
        ></input>
        <label htmlFor="lastName">Фамилно име:</label>
        <input
          onChange={(e) => {
            setLastName(e.target.value);
          }}
          name="lastName"
          type="text"
        ></input>
        <label htmlFor="phoneNumber">Телефон:</label>
        <input
          onChange={(e) => {
            setPhoneNumber(e.target.value);
          }}
          name="phoneNumber"
          type="text"
        ></input>
        <label htmlFor="email">Имейл:</label>
        <input
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          name="email"
          type="text"
        ></input>
        <label htmlFor="dateEmployed">Дата на назначаване:</label>
        <input
          onChange={(e) => {
            setDateEmployed(e.target.value);
          }}
          name="dateEmployed"
          type="date"
        ></input>
        <label htmlFor="active">Статус:</label>
        <input
          onChange={(e) => {
            setActive(true);
          }}
          name="active"
          type="radio"
          value="Активен"
        ></input>
        <input
          onChange={(e) => {
            setActive(false);
          }}
          name="active"
          type="radio"
          value="Уволнен"
        ></input>
        <label htmlFor="releaseDate">
          <span>Пуснат от длъжност на:</span>
        </label>
        <input
          onChange={(e) => {
            setReleaseDate(e.target.value);
          }}
          name="releaseDate"
          type="date"
        ></input>
        <button type="submit">Добави</button>
      </form>
      <h1>Users:</h1>
      <ul>
        {users ? Object.values(users).map((u) => formatUser(u)) : "Loading..."}
      </ul>
    </div>
  );
}
