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

export function setData(path, data) {
  firebase
    .database()
    .ref(`${path}/`)
    .update(data)
    .catch((e) => console.log(`${e.code}\n${e.message}`));
}

export async function deleteData(path, id) {
  firebase.database().ref(`${path}/${id}`).remove();
}

export async function orderData(path, query, ammount) {
  let response = await firebase
    .database()
    .ref(`${path}/`)
    .orderByChild(query)
    .limitToFirst(ammount)
    .once("value");

  if (response.code) {
    throw new Error(response.code);
  } else {
    const data = [];
    response.forEach((v) => {
      data.push(v.val());
    });
    return data;
  }
}

export async function pullData(path, query) {
  let response = await firebase
    .database()
    .ref(`${path}/`)
    .orderByChild(query)
    .once("value");

  if (response.code) {
    throw new Error(response.code);
  } else {
    const data = [];
    response.forEach((v) => {
      data.push(v.val());
    });
    return data;
  }
}

const firebaseInstance = {
  database: firebase.database,
  auth: firebase.auth,
};

export default firebaseInstance;
