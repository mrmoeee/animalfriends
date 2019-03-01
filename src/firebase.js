import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyC_MPpC1Xf9WRddmDaO9yQaeAWWnTzoUuw",
  authDomain: "fun-food-friends-c6cca.firebaseapp.com",
  databaseURL: "https://fun-food-friends-c6cca.firebaseio.com",
  projectId: "fun-food-friends-c6cca",
  storageBucket: "fun-food-friends-c6cca.appspot.com",
  messagingSenderId: "1064788855921"
};

firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;