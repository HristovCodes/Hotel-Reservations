import React, { useEffect, useState } from "react";
import { orderData, setData, deleteData } from "../../firebase";
import "../SharedStyles/styles.scss";

export default function Room() {
  const [rooms, setRooms] = useState();
  const [search, setSearch] = useState();

  useEffect(() => {
    if (!rooms) pullRooms("capacity", 10);
  });

  const searchRoom = (query) => {
    let temp = rooms.slice();
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

  // takes care of the initial call to the db to get all the rooms
  const pullRooms = (sorting, pagination) => {
    orderData("room", sorting, pagination)
      .then((u) => {
        setRooms(u);
      })
      .catch((e) => console.log(e));
  };

  const formatRoom = (clientsData) => {
    return clientsData
      ? clientsData.map((room) => (
          <span key={room.number}>
            <p>{room.capacity}</p>
            <p>{room.type}</p>
            <p>{room.occupied.toString()}</p>
            <p>{room.adult}</p>
            <p>{room.kid}</p>
            <p>{room.number}</p>
            <p
              className="action"
              onClick={() => {
                deleteData("room", room.number);
                let temp = rooms.slice();
                temp.splice(temp.indexOf(room), 1);
                setRooms(temp);
              }}
            >
              Delete
            </p>
          </span>
        ))
      : "Loading...";
  };

  return (
    <div>
      <h2>Add rooms:</h2>
      <Form rooms={rooms} setRooms={setRooms}></Form>
      <h1>Rooms:</h1>
      <div>
        <label htmlFor="search">Search:</label>
        <input
          name="search"
          type="text"
          onChange={(e) => searchRoom(e.target.value)}
        ></input>
      </div>
      <div>
        <button
          type="button"
          onClick={() => {
            pullRooms("capacity", 10);
          }}
        >
          10
        </button>
        <button
          type="button"
          onClick={() => {
            pullRooms("capacity", 25);
          }}
        >
          25
        </button>
        <button
          type="button"
          onClick={() => {
            pullRooms("capacity", 50);
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
              pullRooms("capacity", 10);
            }}
          >
            capacity
          </p>
          <p
            className="clickable"
            onClick={() => {
              pullRooms("type", 10);
            }}
          >
            type
          </p>
          <p
            className="clickable"
            onClick={() => {
              pullRooms("occupation", 10);
            }}
          >
            occupation
          </p>
          <p>adultPrice</p>
          <p>kidPrice</p>
          <p>roomNumber</p>
          <p>Delete</p>
        </span>
        {search ? formatRoom(search) : formatRoom(rooms)}
      </div>
    </div>
  );
}

function Form({ rooms, setRooms }) {
  const [open, setOpen] = useState(false);
  const [capacity, setCapacity] = useState("");
  const [type, setType] = useState("");
  const [occupied, setOccupied] = useState(false);
  const [adult, setAdult] = useState("");
  const [kid, setKid] = useState("");
  const [number, setNumber] = useState("");

  const addRoom = (e) => {
    e.preventDefault();
    e.target.reset();

    if (capacity && type && adult && kid && number) {
      // create the object and push it to the db
      let data = {};
      data[number] = {
        capacity: capacity,
        type: type,
        occupied: occupied,
        adult: adult,
        kid: kid,
        number: number,
      };
      setData("room", data);

      // update the state with the new object so we don't have to pull whole db again
      let temp = rooms.slice();
      let match = false;
      temp.forEach((u) => {
        if (Object.values(u).includes(number)) {
          temp[temp.indexOf(u)] = data[number];
          setRooms(temp);
          setOpen(false);
          match = true;
        }
      });
      if (!match) {
        temp.push(data[number]);
        setRooms(temp);
        setOpen(false);
      }
    }
  };
  return open ? (
    <form className="form" onSubmit={addRoom}>
      <label htmlFor="capacity">Капацитет:</label>
      <input
        onChange={(e) => {
          setCapacity(e.target.value);
        }}
        name="capacity"
        type="text"
      ></input>
      <label htmlFor="type">Тип:</label>
      <input
        onChange={(e) => {
          setType(e.target.value);
        }}
        name="type"
        type="text"
      ></input>
      <label htmlFor="occupied">Свободна:</label>
      <div>
        <input
          onChange={(e) => {
            setOccupied(true);
          }}
          name="occupied"
          id="occ1"
          type="radio"
          value="Активен"
        ></input>
        <label htmlFor="occ1">Да</label>
      </div>
      <div>
        <input
          onChange={(e) => {
            setOccupied(false);
          }}
          name="occupied"
          id="occ2"
          type="radio"
          value="Уволнен"
        ></input>
        <label htmlFor="occ2">Не</label>
      </div>
      <label htmlFor="adult">Цена за възрастен на легло:</label>
      <input
        onChange={(e) => {
          setAdult(e.target.value);
        }}
        name="adult"
        type="text"
      ></input>
      <label htmlFor="kid">Цена за дете на легло:</label>
      <input
        onChange={(e) => {
          setKid(e.target.value);
        }}
        name="kid"
        type="text"
      ></input>
      <label htmlFor="number">Номер на стаята:</label>
      <input
        onChange={(e) => {
          setNumber(e.target.value);
        }}
        name="number"
        type="text"
      ></input>
      <button type="submit">Добави</button>
    </form>
  ) : (
    <button
      onClick={() => {
        setOpen(true);
      }}
    >
      Add/Edit room
    </button>
  );
}
