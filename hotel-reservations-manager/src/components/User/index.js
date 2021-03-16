import React, { useEffect, useState } from "react";
import firebase from "../../firebase";
import "./styles.scss";

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
  const pullUsers = (pagination) => {
    firebase
      .getUser("username", pagination)
      .then((u) => {
        setUsers(u);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    if (!users) pullUsers(10);
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
      <span key={user.id}>
        <p>{user.id}</p>
        <p>{user.username}</p>
        <p>{user.firstname}</p>
        <p>{user.middlename}</p>
        <p>{user.lastname}</p>
        <p>{user.email.slice(0, user.email.indexOf("@"))}</p>
        <p className="action">Edit</p>
        <p className="action">Delete</p>
        {/* <p>{user.phonenumber}</p>
        <p>{user.dateemployed}</p>
        <p>{user.active.toString()}</p>
        <p>{user.releasedate}</p> */}
      </span>
    ) : (
      ""
    );
  };

  return (
    <div>
      <h2>Add users:</h2>
      <form className="usersForm" onSubmit={addUser}>
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
        <div>
          <input
            onChange={(e) => {
              setActive(true);
            }}
            name="active"
            id="act1"
            type="radio"
            value="Активен"
          ></input>
          <label htmlFor="act1">Активен</label>
        </div>
        <div>
          <input
            onChange={(e) => {
              setActive(false);
            }}
            name="active"
            id="act2"
            type="radio"
            value="Уволнен"
          ></input>
          <label htmlFor="act2">Не активен</label>
        </div>
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
      <div>
        <button
          type="button"
          onClick={() => {
            pullUsers(10);
          }}
        >
          10
        </button>
        <button
          type="button"
          onClick={() => {
            pullUsers(25);
          }}
        >
          25
        </button>
        <button
          type="button"
          onClick={() => {
            pullUsers(50);
          }}
        >
          50
        </button>
      </div>
      <div className="usersList">
        <span className="columns">
          <p>ID</p>
          <p>username</p>
          <p>firstName</p>
          <p>middleName</p>
          <p>lastName</p>
          <p>email</p>
          <p>Edit</p>
          <p>Delete</p>
        </span>
        {users ? Object.values(users).map((u) => formatUser(u)) : "Loading..."}
      </div>
    </div>
  );
}
