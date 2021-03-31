import React, { useEffect, useState } from "react";
import { orderData, setData, deleteData } from "../../firebase";
import "../SharedStyles/styles.scss";

export default function User() {
  const [users, setUsers] = useState();
  const [search, setSearch] = useState();

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

  const formatUser = (usersData) => {
    console.log(usersData);
    return usersData ? (
      usersData.map((user) => (
        <UserRow
          key={user.uid}
          data={user}
          users={users}
          setUsers={setUsers}
        ></UserRow>
      ))
    ) : (
      <span className="datarow" key="000"></span>
    );
  };

  return (
    <div className="dbview">
      <h1>Users:</h1>
      <div className="buttons">
        <div>
          <label className="lbl" htmlFor="search">
            Search:
          </label>
          <input
            className="inp"
            name="search"
            type="text"
            onChange={(e) => searchUser(e.target.value)}
          ></input>
        </div>
        <Form users={users} setUsers={setUsers}></Form>
        <div>
          <button
            className="btn count"
            type="button"
            onClick={() => {
              pullUsers("id", 10);
            }}
          >
            10
          </button>
          <button
            className="btn count"
            type="button"
            onClick={() => {
              pullUsers("id", 25);
            }}
          >
            25
          </button>
          <button
            className="btn count"
            type="button"
            onClick={() => {
              pullUsers("id", 50);
            }}
          >
            50
          </button>
        </div>
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
          <p>phoneNumber</p>
          <p>dateEmployed</p>
          <p>active</p>
          <p>dateReleased</p>
          <p>Delete</p>
        </span>
        {search ? formatUser(search) : formatUser(users)}
      </div>
    </div>
  );
}

function Form({ users, setUsers }) {
  const [open, setOpen] = useState(false);
  const [uid, setUID] = useState("");
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

  const addUser = (e) => {
    e.preventDefault();
    e.target.reset();

    if (
      uid &&
      id &&
      username &&
      firstName &&
      middleName &&
      lastName &&
      phoneNumber &&
      email &&
      dateEmployed
    ) {
      // create the object and push it to the db
      let data = {};
      data[uid] = {
        id: id,
        uid: uid,
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
      let match = false;
      temp.forEach((u) => {
        if (Object.values(u).includes(phoneNumber)) {
          temp[temp.indexOf(u)] = data[uid];
          setUsers(temp);
          setOpen(false);
          match = true;
        }
      });
      if (!match) {
        temp.push(data[uid]);
        setUsers(temp);
        setOpen(false);
      }
    }
  };

  return (
    <div>
      <form className={open ? "form splitform" : "closed"} onSubmit={addUser}>
        <div className="partone">
          <label className="lbl" htmlFor="uid">
            UID:
          </label>
          <input
            className="inp"
            onChange={(e) => {
              setUID(e.target.value);
            }}
            name="uid"
            type="text"
          ></input>
          <label className="lbl" htmlFor="id">
            ЕГН:
          </label>
          <input
            className="inp"
            onChange={(e) => {
              setID(e.target.value);
            }}
            name="id"
            type="text"
          ></input>
          <label className="lbl" htmlFor="username">
            Потребителско име:
          </label>
          <input
            className="inp"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            name="username"
            type="text"
          ></input>
          <label className="lbl" htmlFor="firstName">
            Име:
          </label>
          <input
            className="inp"
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            name="firstName"
            type="text"
          ></input>
          <label className="lbl" htmlFor="middleName">
            Бащино име:
          </label>
          <input
            className="inp"
            onChange={(e) => {
              setMiddleName(e.target.value);
            }}
            name="middleName"
            type="text"
          ></input>
          <label className="lbl" htmlFor="lastName">
            Фамилно име:
          </label>
          <input
            className="inp"
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            name="lastName"
            type="text"
          ></input>
        </div>
        <div className="parttwo">
          <label className="lbl" htmlFor="phoneNumber">
            Телефон:
          </label>
          <input
            className="inp"
            onChange={(e) => {
              setPhoneNumber(e.target.value);
            }}
            name="phoneNumber"
            type="text"
          ></input>
          <label className="lbl" htmlFor="email">
            Имейл:
          </label>
          <input
            className="inp"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            name="email"
            type="text"
          ></input>
          <label className="lbl" htmlFor="dateEmployed">
            Дата на назначаване:
          </label>
          <input
            className="inp"
            onChange={(e) => {
              setDateEmployed(e.target.value);
            }}
            name="dateEmployed"
            type="date"
          ></input>
          <label className="lbl" htmlFor="active">
            Статус:
          </label>
          <div>
            <input
              className="inp"
              onChange={(e) => {
                setActive(true);
              }}
              name="active"
              id="act1"
              type="radio"
              value="Активен"
            ></input>
            <label className="lbl" htmlFor="act1">
              Активен
            </label>
          </div>
          <div>
            <input
              className="inp"
              onChange={(e) => {
                setActive(false);
              }}
              name="active"
              id="act2"
              type="radio"
              value="Уволнен"
            ></input>
            <label className="lbl" htmlFor="act2">
              Не активен
            </label>
          </div>
          <label className="lbl" htmlFor="releaseDate">
            <span>Пуснат от длъжност на:</span>
          </label>
          <input
            className="inp"
            onChange={(e) => {
              setReleaseDate(e.target.value);
            }}
            name="releaseDate"
            type="date"
          ></input>
          <button className="btn formbtn" type="submit">
            Добави
          </button>
        </div>
      </form>
      <button
        className="btn addedit"
        onClick={() => {
          setOpen(!open);
        }}
      >
        {open ? "Close form" : "Add/Edit client"}
      </button>
    </div>
  );
}

function UserRow({ data, users, setUsers, uid }) {
  const [active, setActive] = useState(data.active);
  return (
    <span className="datarow">
      <p>{data.id}</p>
      <p>{data.username}</p>
      <p>{data.firstname}</p>
      <p>{data.middlename}</p>
      <p>{data.lastname}</p>
      <p>{data.email.slice(0, data.email.indexOf("@"))}</p>
      <p>{data.phonenumber}</p>
      <p>{data.dateemployed}</p>
      <p
        className="clickable"
        onClick={() => {
          setData(`user/${data.uid}`, { active: !active });
          setActive(!active);
        }}
      >
        {active.toString()}
      </p>
      {data.releasedate ? <p>{data.releasedate}</p> : <p>-</p>}
      <p
        className="action"
        onClick={() => {
          deleteData("user", data.id);
          let temp = users.slice();
          temp.splice(temp.indexOf(data), 1);
          setUsers(temp);
        }}
      >
        Delete
      </p>
    </span>
  );
}
