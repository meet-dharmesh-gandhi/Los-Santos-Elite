import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDkyVx5KlQU9-ouGQs_38Op4b5G9ilKnOw",
  authDomain: "oauth-testing-87605.firebaseapp.com",
  projectId: "oauth-testing-87605",
  storageBucket: "oauth-testing-87605.appspot.com",
  messagingSenderId: "227394058166",
  appId: "1:227394058166:web:5b5f0fdb475c88172c3317",
  measurementId: "G-RPM0GQSP3X",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const user = auth.currentUser;

function updateUserProfile(user) {
  const userName = user.displayName;
  console.log(userName);
  const userEmail = user.email;
  const userProfilePicture = user.photoURL;
  console.log(userEmail);

  document.getElementById("userName").textContent = userName;
  document.getElementById("userEmail").textContent = userEmail;
  document.getElementById("userProfilePicture").src = userProfilePicture;
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    updateUserProfile(user);
    const uid = user.uid;
    return uid;
  } else {
    alert("Create Account & Login");
    window.location.href = "";
  }
});