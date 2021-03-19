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

export function setUser(
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
) {
  let data = {};
  data[email.slice(0, email.indexOf("@"))] = {
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
  // to do:
  // also needs to create a auth object (sign in the user)

  firebase
    .database()
    .ref("user/")
    .update(data)
    .catch((e) => console.log(`${e.code}\n${e.message}`));
}

export async function getUser(query, ammount) {
  // query can be: "id", "username", "firstname", "middlename", "lastname", "email", ""
  let response = await firebase
    .database()
    .ref("user/")
    .orderByChild(query)
    .limitToFirst(ammount)
    .once("value");

  if (response.code) {
    throw new Error(response.code);
  } else {
    const userData = [];
    response.forEach((v) => {
      userData.push(v.val());
    });
    return userData;
  }
}

const firebaseInstance = {
  database: firebase.database,
  auth: firebase.auth,
};

export default firebaseInstance;
