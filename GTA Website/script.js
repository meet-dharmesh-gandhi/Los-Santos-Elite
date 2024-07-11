import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDkyVx5KlQU9-ouGQs_38Op4b5G9ilKnOw",
  authDomain: "oauth-testing-87605.firebaseapp.com",
  projectId: "oauth-testing-87605",
  storageBucket: "oauth-testing-87605.appspot.com",
  messagingSenderId: "227394058166",
  appId: "1:227394058166:web:5b5f0fdb475c88172c3317",
  measurementId: "G-RPM0GQSP3X"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();


const loginButton = document.querySelector("#loginButton");
loginButton.addEventListener("click", function(){
  signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;
    console.log(user);
    window.location.href = "./loggedIn.html";
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
});

updateUserProfile();