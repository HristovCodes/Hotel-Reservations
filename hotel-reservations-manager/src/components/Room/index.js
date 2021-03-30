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

  const formatRoom = (roomsData) => {
    return roomsData ? (
      roomsData.map((room) => (
        <RoomRow
          key={room.number}
          data={room}
          rooms={rooms}
          setRooms={setRooms}
        ></RoomRow>
      ))
    ) : (
      <span className="datarow" key="000"></span>
    );
  };

  return (
    <div className="dbview">
      <h1>Rooms:</h1>
      <div className="buttons">
        <div>
          <label className="lbl" htmlFor="search">
            Search:
          </label>
          <input
            className="inp"
            name="search"
            type="text"
            onChange={(e) => searchRoom(e.target.value)}
          ></input>
        </div>
        <Form rooms={rooms} setRooms={setRooms}></Form>
        <div>
          <button
            className="btn count"
            type="button"
            onClick={() => {
              pullRooms("capacity", 10);
            }}
          >
            10
          </button>
          <button
            className="btn count"
            type="button"
            onClick={() => {
              pullRooms("capacity", 25);
            }}
          >
            25
          </button>
          <button
            className="btn count"
            type="button"
            onClick={() => {
              pullRooms("capacity", 50);
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
  return (
    <div>
      <form className={open ? "form normalform" : "closed"} onSubmit={addRoom}>
        <label className="lbl" htmlFor="capacity">
          Капацитет:
        </label>
        <input
          className="inp"
          onChange={(e) => {
            setCapacity(e.target.value);
          }}
          name="capacity"
          type="text"
        ></input>
        <label className="lbl" htmlFor="type">
          Тип:
        </label>
        <input
          className="inp"
          onChange={(e) => {
            setType(e.target.value);
          }}
          name="type"
          type="text"
        ></input>
        <label className="lbl" htmlFor="occupied">
          Свободна:
        </label>
        <div>
          <input
            className="inp"
            onChange={(e) => {
              setOccupied(true);
            }}
            name="occupied"
            id="occ1"
            type="radio"
            value="Активен"
          ></input>
          <label className="lbl" htmlFor="occ1">
            Да
          </label>
        </div>
        <div>
          <input
            className="inp"
            onChange={(e) => {
              setOccupied(false);
            }}
            name="occupied"
            id="occ2"
            type="radio"
            value="Уволнен"
          ></input>
          <label className="lbl" htmlFor="occ2">
            Не
          </label>
        </div>
        <label className="lbl" htmlFor="adult">
          Цена за възрастен на легло:
        </label>
        <input
          className="inp"
          onChange={(e) => {
            setAdult(e.target.value);
          }}
          name="adult"
          type="text"
        ></input>
        <label className="lbl" htmlFor="kid">
          Цена за дете на легло:
        </label>
        <input
          className="inp"
          onChange={(e) => {
            setKid(e.target.value);
          }}
          name="kid"
          type="text"
        ></input>
        <label className="lbl" htmlFor="number">
          Номер на стаята:
        </label>
        <input
          className="inp"
          onChange={(e) => {
            setNumber(e.target.value);
          }}
          name="number"
          type="text"
        ></input>
        <button className="btn formbtn" type="submit">
          Добави
        </button>
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

function RoomRow({ data, rooms, setRooms }) {
  const [occupied, setOccupied] = useState(data.occupied);
  return (
    <span className="datarow">
      <p>{data.capacity}</p>
      <p>{data.type}</p>
      <p
        className="clickable"
        onClick={() => {
          setData(`room/${data.number}`, { occupied: !occupied });
          setOccupied(!occupied);
        }}
      >
        {occupied.toString()}
      </p>
      <p>{data.adult}</p>
      <p>{data.kid}</p>
      <p>{data.number}</p>
      <p
        className="action clickable"
        onClick={() => {
          deleteData("room", data.number);
          let temp = rooms.slice();
          temp.splice(temp.indexOf(data), 1);
          setRooms(temp);
        }}
      >
        Delete
      </p>
    </span>
  );
}
