import * as firebase from "firebase/app";
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

let event = (title, date, desc, pic, location, fee) => {
  if (title && date && desc && pic && location) {
    let newPostKey = firebase.database().ref().child("events").push().key;
    let data = {};
    data[newPostKey] = {
      eventTitle: title,
      eventDate: date,
      eventDesc: desc,
      eventUrl: pic,
      eventLocation: location,
      eventEntryFee: fee,
    };
    firebase
      .database()
      .ref("events/" + date)
      .update(data);
  }
};

export default {
  submitEvent: event,
  database: firebase.database(),
  auth: firebase.auth(),
  userData: firebase.auth().currentUser,
};
