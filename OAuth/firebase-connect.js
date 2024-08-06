import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { redirectUser } from "../JS Files/sign-in-page.js";

const urlParams = new URLSearchParams(window.location.search);
const nextPage = urlParams.get("goto");

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
provider.setCustomParameters({ prompt: "select_account" });
let updateNow = false;

async function updateUserProfile(user, authMethod) {
  const userName = user.displayName;
  const userEmail = user.email;
  const userProfilePicture = user.photoURL;
  const userExists = await fetch("http://localhost:3000/user-email-exists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ Email: userEmail }),
  });
  if (!userExists.ok) {
    throw new Error("Error checking user email");
  };
  const userExistsResponse = await userExists.json();
  if (JSON.stringify(userExistsResponse[0]) === "\"true\"" && authMethod === "Sign In") {
    const setUserDetails = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName: (userExistsResponse[1][0].username), userEmail, userProfilePicture }),
    });
    const data = await setUserDetails.json();
    if (data.token) {
      localStorage.setItem("user details token", data.token);
    }
    redirectUser();
  } else if (JSON.stringify(userExistsResponse[0]) === "\"false\"" && authMethod === "Sign Up") {
    addNewUser(userName, userEmail, document.querySelector(".password"));
  } else if (authMethod === "Sign Up") {
    alert("Account Exists!!");
  } else if (authMethod === "Sign In") {
    alert("No such Account Exists!!");
  }
}

const loginButton = document.querySelector("#loginButton");
if (loginButton !== null) {
  loginButton.addEventListener("click", function () {
    updateNow = true;
    console.log("Starting OAuth...");
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        updateUserProfile(user, "Sign In").then(() => {
          console.log("OAuth completed successfully, redirecting now!!");
        })
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  });
}


const signUpButton = document.querySelector("#signUpButton");
if (signUpButton !== null) {
  signUpButton.addEventListener("click", function () {
    updateNow = true;
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        updateUserProfile(user, "Sign Up")
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  });
}

onAuthStateChanged(auth, (user) => {
  if (user && updateNow) {
    updateUserProfile(user, "false");
    const uid = user.uid;
    return uid;
  } else if (loginButton !== null) {
    alert("Login with Registered Account");
  }
});

const addNewUser = async (username, email, password) => {
  try {
    const response = await fetch("http://localhost:3000/add-new-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        cart: { car: [], house: [], gun: [] },
        wishlist: [],
        'Builder Ratings': { 'Downtown builders': 0, 'Elite Builders': 0, 'Goldstein & Co.': 0, 'Luxury estates': 0, 'Modern Estates': 0, 'Skyline Developers': 0, 'Tinsel builders': 0, 'Urban spaces': 0, 'vinewood estates': 0 },
        'E Wallet': { Seller: false, Balance: 0 },
        'Transaction History': [],
        "Email Address": email,
        Name: "",
        "Phone Number": "",
        OTP: { OTP: "", expiresAt: new Date(), createdAt: new Date() }
      }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong!! Status: " + response.status);
    }
    const data = await response.json();
    console.log("data: " + data);
    if (data === "Username Exists!!") {
      alert("Username Exists!!");
    } else {
      window.location.href = `../HTML Files/sign-in-page.html?new-account=true&goto=${nextPage}`;
    }
  } catch (error) {
    console.error("Error adding credentials: ", error);
  }
};