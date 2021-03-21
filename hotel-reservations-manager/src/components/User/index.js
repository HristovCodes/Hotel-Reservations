import React, { useEffect, useState } from "react";
import { orderData, setData, deleteData } from "../../firebase";
import "../SharedStyles/styles.scss";

export default function User() {
  const [users, setUsers] = useState();
  const [search, setSearch] = useState();
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

  useEffect(() => {
    if (!users) pullUsers("id", 10);
  });

  const searchUser = (query) => {
    let temp = users.slice();
    let matches = [];
    temp.forEach((u) => {
      if (Object.values(u).includes(query)) {
        matches.push(u);
      }
    });
    if (matches.length > 0) {
      return setSearch(matches);
    }
    setSearch(undefined);
  };

  // takes care of the initial call to the db to get all the users
  const pullUsers = (sorting, pagination) => {
    orderData("user", sorting, pagination)
      .then((u) => {
        setUsers(u);
      })
      .catch((e) => console.log(e));
  };

  const addUser = (e) => {
    e.preventDefault();
    e.target.reset();

    // create the object and push it to the db
    let data = {};
    data[id] = {
      id: id,
      username: username,
      firstname: firstName,
      middlename: middleName,
      lastname: lastName,
      phonenumber: phoneNumber,
      email: email,
      dateemployed: dateEmployed,
      active: active,
      releasedate: releaseDate,
    };
    setData("user", data);

    // update the state with the new object so we don't have to pull whole db again
    let temp = users.slice();
    temp.push(data[id]);
    setUsers(temp);
  };

  const formatUser = (usersData) => {
    return usersData
      ? usersData.map((user) => (
          <span key={user.id}>
            <p>{user.id}</p>
            <p>{user.username}</p>
            <p>{user.firstname}</p>
            <p>{user.middlename}</p>
            <p>{user.lastname}</p>
            <p>{user.email.slice(0, user.email.indexOf("@"))}</p>
            <p className="action">Edit</p>
            <p
              className="action"
              onClick={() => {
                deleteData("user", user.id);
                let temp = users.slice();
                temp.splice(temp.indexOf(user), 1);
                setUsers(temp);
              }}
            >
              Delete
            </p>
            {/* <p>{user.phonenumber}</p>
        <p>{user.dateemployed}</p>
        <p>{user.active.toString()}</p>
        <p>{user.releasedate}</p> */}
          </span>
        ))
      : "Loading...";
  };

  return (
    <div>
      <h2>Add users:</h2>
      <form className="form" onSubmit={addUser}>
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
        <label htmlFor="search">Search:</label>
        <input
          name="search"
          type="text"
          onChange={(e) => searchUser(e.target.value)}
        ></input>
      </div>
      <div>
        <button
          type="button"
          onClick={() => {
            pullUsers("id", 10);
          }}
        >
          10
        </button>
        <button
          type="button"
          onClick={() => {
            pullUsers("id", 25);
          }}
        >
          25
        </button>
        <button
          type="button"
          onClick={() => {
            pullUsers("id", 50);
          }}
        >
          50
        </button>
      </div>
      <div className="list">
        <span className="columns">
          <p
            className="clickable"
            onClick={() => {
              pullUsers("id", 10);
            }}
          >
            ID
          </p>
          <p
            className="clickable"
            onClick={() => {
              pullUsers("username", 10);
            }}
          >
            username
          </p>
          <p
            className="clickable"
            onClick={() => {
              pullUsers("firstname", 10);
            }}
          >
            firstName
          </p>
          <p
            className="clickable"
            onClick={() => {
              pullUsers("middlename", 10);
            }}
          >
            middleName
          </p>
          <p
            className="clickable"
            onClick={() => {
              pullUsers("lastname", 10);
            }}
          >
            lastName
          </p>
          <p
            className="clickable"
            onClick={() => {
              pullUsers("email", 10);
            }}
          >
            email
          </p>
          <p>Edit</p>
          <p>Delete</p>
        </span>
        {search ? formatUser(search) : formatUser(users)}
      </div>
    </div>
  );
}
