import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAY0spgQbLTx1eF4UfPwzC4vUOLOiZ99LQ",
  authDomain: "hotel-reservations-itk.firebaseapp.com",
  databaseURL: "https://hotel-reservations-itk-default-rtdb.firebaseio.com",
  projectId: "hotel-reservations-itk",
  storageBucket: "hotel-reservations-itk.appspot.com",
  messagingSenderId: "199246928160",
  appId: "1:199246928160:web:7ec21b444b4660d8ec1f45",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const setUser = (
  id,
  username,
  firstname,
  middlename,
  lastname,
  phonenumber,
  email,
  dateemployed,
  active,
  releasedate
) => {
  let data = {};
  data[id] = {
    id: id,
    username: username,
    firstname: firstname,
    middlename: middlename,
    lastname: lastname,
    phonenumber: phonenumber,
    email: email,
    dateemployed: dateemployed,
    active: active,
    releasedate: releasedate,
  };
  firebase.database().ref("user/").update(data);
};

const getUser = (query = "id") => {
  // query can be: "id", "username", "firstname", "middlename", "lastname", "email", ""
  firebase
    .database()
    .child("user/")
    .orderByChild(query)
    .get()
    .then((data) => {
      if (data.exists()) return data.val();
      return null;
    });
};

export default {
  setUser: setUser,
  getUser: getUser,
  database: firebase.database,
  auth: firebase.auth,
};
