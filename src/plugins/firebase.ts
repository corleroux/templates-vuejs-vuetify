import firebase from "firebase";
import "firebase/firestore";

// firebase init goes here
const config = {
  apiKey: "AIzaSyDiawazvh-Uwgjc9SqJCoU6nPYQYlIbRpQ",
  authDomain: "cropchat-ab5a9.firebaseapp.com",
  databaseURL: "https://cropchat-ab5a9.firebaseio.com",
  projectId: "cropchat-ab5a9",
  storageBucket: "cropchat-ab5a9.appspot.com",
  messagingSenderId: "1084557590205"
};
firebase.initializeApp(config);

// firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
const currentUser = auth.currentUser;

// firebase collections
const usersCollection = db.collection("users");
const postsCollection = db.collection("posts");
const commentsCollection = db.collection("comments");
const likesCollection = db.collection("likes");
const leadsCollection = db.collection("leads");

export {
  db,
  auth,
  currentUser,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection,
  leadsCollection
};
