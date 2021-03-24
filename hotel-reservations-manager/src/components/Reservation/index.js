import React, { useEffect, useState } from "react";
import firebaseInstance, {
  orderData,
  setData,
  deleteData,
  pullData,
} from "../../firebase";
import "../SharedStyles/styles.scss";

export default function Reservation() {
  const [reservations, setReservations] = useState();
  const [search, setSearch] = useState();

  useEffect(() => {
    if (!reservations) pullReservations("capacity", 10);
  });

  const searchReservation = (query) => {
    let temp = reservations.slice();
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

  // takes care of the initial call to the db to get all the reservations
  const pullReservations = (sorting, pagination) => {
    orderData("reservation", sorting, pagination)
      .then((u) => {
        setReservations(u);
      })
      .catch((e) => console.log(e));
  };

  const formatReservation = (reservationsData) => {
    return reservationsData
      ? reservationsData.map((reservation) => (
          <span key={`${reservation.dateaccommodation}${reservation.roomnum}`}>
            <p>{reservation.roomnum}</p>
            <p>{reservation.usercreated.id}</p>
            <p>{reservation.price}</p>
            <div>
              {Object.values(reservation.occupants).map((o) => {
                // add an on click that shows reservations for this user here or in users not sure
                return <p>{`${o.firstname} ${o.lastname}`}</p>;
              })}
            </div>
            <p>{reservation.dateaccommodation}</p>
            <p>{reservation.daterelease}</p>
            <p>{reservation.breakfast.toString()}</p>
            <p>{reservation.allinclusive.toString()}</p>
            <p
              className="action"
              onClick={() => {
                deleteData(
                  "reservation",
                  `${reservation.dateaccommodation} | ${reservation.roomnum}`
                );
                let temp = reservations.slice();
                temp.splice(temp.indexOf(reservation), 1);
                setReservations(temp);
              }}
            >
              Delete
            </p>
          </span>
        ))
      : "Loading...";
  };

  return (
    <div className="dbview">
      <h2>Add reservations:</h2>
      <Form
        reservations={reservations}
        setReservations={setReservations}
      ></Form>
      <h1>Reservations:</h1>
      <div>
        <label htmlFor="search">Search:</label>
        <input
          name="search"
          type="text"
          onChange={(e) => searchReservation(e.target.value)}
        ></input>
      </div>
      <div>
        <button
          type="button"
          onClick={() => {
            pullReservations("roomnum", 10);
          }}
        >
          10
        </button>
        <button
          type="button"
          onClick={() => {
            pullReservations("roomnum", 25);
          }}
        >
          25
        </button>
        <button
          type="button"
          onClick={() => {
            pullReservations("roomnum", 50);
          }}
        >
          50
        </button>
      </div>
      <div className="list">
        <span className="columns">
          <p>roomNum</p>
          <p>userCreated</p>
          <p>price</p>
          <p>occupants</p>
          <p>dateAccommodation</p>
          <p>dateRelease</p>
          <p>breakfast</p>
          <p>allInclusive</p>
          <p>Delete</p>
        </span>
        {search ? formatReservation(search) : formatReservation(reservations)}
      </div>
    </div>
  );
}

function Form({ reservations, setReservations }) {
  const [open, setOpen] = useState(false);
  const [searchOccupant, setSearchOccupant] = useState("");
  const [users, setUsers] = useState();
  const [clients, setClients] = useState();
  const [rooms, setRooms] = useState();
  const [roomNum, setRoomNum] = useState("");
  const [userCreated, setUserCreated] = useState();
  const [occupants, setOccupants] = useState([]);
  const [dateAccommodation, setDateAccomodation] = useState("");
  const [dateRelease, setDateRelease] = useState("");
  const [breakfast, setBreakfast] = useState(false);
  const [allInclusive, setAllInclusive] = useState(false);

  useEffect(() => {
    if (!users) {
      pullData("user", "id").then((data) => {
        setUsers(data);
      });
    }
    if (!userCreated && users) {
      let temp = users.slice();
      temp.forEach((u) => {
        if (u.email === firebaseInstance.auth().currentUser.email) {
          setUserCreated(u);
        }
      });
    }
    if (!clients) {
      pullData("client", "phonenumber").then((data) => {
        setClients(data);
      });
    }
    if (!rooms) {
      pullData("room", "phonenumber").then((data) => {
        setRooms(data);
      });
    }
  });

  const addReservation = (e) => {
    e.preventDefault();
    e.target.reset();

    if (
      roomNum &&
      userCreated &&
      occupants &&
      dateAccommodation &&
      dateRelease
    ) {
      let datediff = Math.floor(
        (Date.parse(dateRelease) - Date.parse(dateAccommodation)) / 86400000
      );
      let price = 0;
      rooms.forEach((r) => {
        if (r.number === roomNum) {
          occupants.forEach((o) => {
            if (o.adult) {
              price += r.adult - 0;
            } else {
              price += r.kid - 0;
            }
          });
        }
      });
      if (allInclusive) {
        price *= 1.5;
      }
      if (breakfast) {
        price *= 1.1;
      }
      price *= datediff;
      // create the object and push it to the db
      let data = {};
      data[`${dateAccommodation} | ${roomNum}`] = {
        roomnum: roomNum,
        usercreated: userCreated,
        occupants: occupants.reduce(
          //eslint-disable-next-line
          (obj, item) => ((obj[item.phonenumber] = item), obj),
          {}
        ),
        dateaccommodation: dateAccommodation,
        daterelease: dateRelease,
        breakfast: breakfast,
        allinclusive: allInclusive,
        price: price.toFixed(2),
      };
      setData("reservation", data);

      // update the state with the new object so we don't have to pull whole db again
      let temp = reservations.slice();
      let match = false;
      temp.forEach((u) => {
        if (Object.values(u).includes(`${dateAccommodation} | ${roomNum}`)) {
          temp[temp.indexOf(u)] = data[`${dateAccommodation} | ${roomNum}`];
          setReservations(temp);
          setOpen(false);
          setOccupants([]);
          match = true;
        }
      });
      if (!match) {
        temp.push(data[`${dateAccommodation} | ${roomNum}`]);
        setReservations(temp);
        setOpen(false);
        setOccupants([]);
      }
    }
  };

  return open ? (
    <form className="form" onSubmit={addReservation}>
      <label htmlFor="roomnum">Номер на стаята:</label>
      <input
        onChange={(e) => {
          setRoomNum(e.target.value);
        }}
        name="roomnum"
        type="text"
      ></input>
      <label htmlFor="occupants">
        Списък с настанени клиенти: *търсенето става по първо или фамилно име*
      </label>
      <input
        onChange={(e) => {
          setSearchOccupant(e.target.value);
        }}
        name="occupants"
        type="search"
      ></input>
      <button
        onClick={() => {
          let temp = clients.slice();
          temp.forEach((c) => {
            // check if the client exists and if we have already added it
            if (
              Object.values(c).includes(searchOccupant) &&
              !occupants.includes(c)
            ) {
              let temp = occupants.slice();
              temp.push(c);
              setOccupants(temp);
            }
          });
        }}
        type="button"
      >
        Добави
      </button>
      {occupants.map((e) => {
        return (
          <div key={e.phonenumber}>
            <p>{`${e.firstname} ${e.lastname}`}</p>
            <button
              onClick={() => {
                let temp = occupants.slice();
                temp.splice(temp.indexOf(e), 1);
                setOccupants(temp);
              }}
              type="button"
            >
              премахни от списъка
            </button>
          </div>
        );
      })}
      <label htmlFor="dateaccomodation">Дата на настаняване:</label>
      <input
        onChange={(e) => {
          setDateAccomodation(e.target.value);
        }}
        name="dateaccomodation"
        type="date"
      ></input>
      <label htmlFor="daterelease">Дата на освобождаване:</label>
      <input
        onChange={(e) => {
          setDateRelease(e.target.value);
        }}
        name="daterelease"
        type="date"
      ></input>
      <label htmlFor="breakfast">Включена закуска:</label>
      <div>
        <input
          onChange={(e) => {
            setBreakfast(true);
          }}
          name="breakfast"
          id="brkf1"
          type="radio"
        ></input>
        <label htmlFor="brkf1">Да</label>
      </div>
      <div>
        <input
          onChange={(e) => {
            setBreakfast(false);
          }}
          name="breakfast"
          id="brkf2"
          type="radio"
        ></input>
        <label htmlFor="brkf2">Не</label>
      </div>
      <label htmlFor="allinclusive">Включен allinclusive:</label>
      <div>
        <input
          onChange={(e) => {
            setAllInclusive(true);
          }}
          name="allinclusive"
          id="alli1"
          type="radio"
        ></input>
        <label htmlFor="alli1">Да</label>
      </div>
      <div>
        <input
          onChange={(e) => {
            setAllInclusive(false);
          }}
          name="allinclusive"
          id="alli2"
          type="radio"
        ></input>
        <label htmlFor="alli2">Не</label>
      </div>
      <button type="submit">Добави</button>
    </form>
  ) : (
    <button
      onClick={() => {
        setOpen(true);
      }}
    >
      Add/Edit reservation
    </button>
  );
}
