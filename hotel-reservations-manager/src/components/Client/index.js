import React, { useEffect, useState } from "react";
import { orderData, setData, deleteData } from "../../firebase";
import "../SharedStyles/styles.scss";

export default function Client() {
  const [clients, setClients] = useState();
  const [search, setSearch] = useState();

  useEffect(() => {
    if (!clients) pullClients("id", 10);
  });

  const searchClient = (query) => {
    let temp = clients.slice();
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

  // takes care of the initial call to the db to get all the clients
  const pullClients = (sorting, pagination) => {
    orderData("client", sorting, pagination)
      .then((u) => {
        setClients(u);
      })
      .catch((e) => console.log(e));
  };

  const formatClient = (clientsData) => {
    return clientsData ? (
      clientsData.map((client) => (
        <span class="datarow" key={client.phonenumber}>
          <p>{client.firstname}</p>
          <p>{client.lastname}</p>
          <p>{client.phonenumber}</p>
          <p>{client.adult.toString()}</p>
          <p>{client.email.slice(0, client.email.indexOf("@"))}</p>
          <p
            className="action"
            onClick={() => {
              deleteData("client", client.phonenumber);
              let temp = clients.slice();
              temp.splice(temp.indexOf(client), 1);
              setClients(temp);
            }}
          >
            Delete
          </p>
        </span>
      ))
    ) : (
      <span className="datarow"></span>
    );
  };

  return (
    <div className="dbview">
      <h1>Clients:</h1>
      <div className="buttons">
        <div>
          <label className="lbl" htmlFor="search">
            Search:
          </label>
          <input
            className="inp"
            name="search"
            type="text"
            onChange={(e) => searchClient(e.target.value)}
          ></input>
        </div>
        <Form clients={clients} setClients={setClients}></Form>
        <div>
          <button
            className="btn count"
            type="button"
            onClick={() => {
              pullClients("id", 10);
            }}
          >
            10
          </button>
          <button
            className="btn count"
            type="button"
            onClick={() => {
              pullClients("id", 25);
            }}
          >
            25
          </button>
          <button
            className="btn count"
            type="button"
            onClick={() => {
              pullClients("id", 50);
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
              pullClients("firstname", 10);
            }}
          >
            firstName
          </p>
          <p
            className="clickable"
            onClick={() => {
              pullClients("lastname", 10);
            }}
          >
            lastName
          </p>
          <p>phoneNumber</p>
          <p>adult</p>
          <p>email</p>
          <p>Delete</p>
        </span>
        {search ? formatClient(search) : formatClient(clients)}
      </div>
    </div>
  );
}

function Form({ clients, setClients }) {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [adult, setAdult] = useState(false);

  const addClient = (e) => {
    e.preventDefault();
    e.target.reset();

    if (firstName && lastName && phoneNumber && email) {
      // create the object and push it to the db
      let data = {};
      data[phoneNumber] = {
        firstname: firstName,
        lastname: lastName,
        phonenumber: phoneNumber,
        email: email,
        adult: adult,
      };
      setData("client", data);

      // update the state with the new object so we don't have to pull whole db again
      let temp = clients.slice();
      let match = false;
      temp.forEach((u) => {
        if (Object.values(u).includes(phoneNumber)) {
          temp[temp.indexOf(u)] = data[phoneNumber];
          setClients(temp);
          setOpen(false);
          match = true;
        }
      });
      if (!match) {
        temp.push(data[phoneNumber]);
        setClients(temp);
        setOpen(false);
      }
    }
  };
  return (
    <div>
      {open ? (
        <form className="form normalform" onSubmit={addClient}>
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
          <label className="lbl" htmlFor="active">
            Статус:
          </label>
          <div>
            <input
              className="inp"
              onChange={(e) => {
                setAdult(true);
              }}
              name="active"
              id="act1"
              type="radio"
              value="Активен"
            ></input>
            <label className="lbl" htmlFor="act1">
              Възрастен
            </label>
          </div>
          <div>
            <input
              className="inp"
              onChange={(e) => {
                setAdult(false);
              }}
              name="active"
              id="act2"
              type="radio"
              value="Уволнен"
            ></input>
            <label className="lbl" htmlFor="act2">
              Дете
            </label>
          </div>
          <button className="btn formbtn" type="submit">
            Добави
          </button>
        </form>
      ) : (
        ""
      )}
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
