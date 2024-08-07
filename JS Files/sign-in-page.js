const urlParams = new URLSearchParams(window.location.search);
const newAccount = urlParams.get("new-account");
const nextPage = urlParams.get("goto");

const serverURL = "https://los-santos-elite-2gyo.onrender.com";

if (newAccount === "true") {
  let toast = document.querySelector("#liveToastBtn");
  toast.addEventListener("click", function () {
    let toastEl = document.querySelector("#liveToast");
    let toast = new bootstrap.Toast(toastEl);
    toast.show();
  });
  toast.click();
}

const username = document.getElementById("userName");
const password = document.getElementById("password");
const signInButon = document.getElementById("sign-in");

if (signInButon !== null) {
  signInButon.addEventListener("click", async () => {
    let input1 = document.querySelector(".input1");
    let input2 = document.querySelector(".input2");
    if (username.value === "" || username.value === " ") {
      setTimeout(() => {
        alert("Please enter your Username !");
      }, 100);
      input1.style.border = "2px solid red";
      input1.addEventListener("click", () => {
        input1.style.border = "none";
        input1.style.borderRadius = "5px";
      });
    } else if (password.value === "" || password.value === " ") {
      setTimeout(() => {
        alert("Please enter your password !");
      }, 100);
      input2.style.border = "2px solid red";
      input2.addEventListener("click", () => {
        input2.style.border = "none";
      });
    } else {
      await checkUserExistence(username.value, password.value);
      username.value = "";
      password.value = "";
    }
  });
}

let animationEnd = document.querySelector(".image img");
animationEnd.addEventListener("animationend", () => {
  animationEnd.style.animation = "moveAstronaut 4s infinite";
});

const checkUserExistence = async (username, password) => {
  try {
    const response = await fetch(serverURL + "/check-user-existence", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong!! Status: " + response.status);
    }
    const data = await response.json();
    if (data === "Incorrect Username or Password") {
      alert("Incorrect Username or Password");
    } else {
      const setUserDetails = await fetch(serverURL + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName: username, userEmail: "", userProfilePicture: "default" }),
        credentials: "include",
      });
      const data2 = await setUserDetails.json();
      localStorage.setItem("user details token", data2.token);
      setTimeout(() => {
        redirectUser();
      }, 1000);
    }
  } catch (error) {
    console.error("Error verifying credentials: ", error);
  }
};

const redirectUser = () => {
  if (nextPage === "real-estate") {
    window.location.href = "../HTML Files/ls-real-estate.html";
  } else if (nextPage === "super-cars") {
    window.location.href = "../HTML Files/ls-super-cars.html";
  } else if (nextPage === "sell") {
    window.location.href = "../HTML Files/sell-page.html";
  } else {
    window.location.href = "../HTML Files/main-page.html";
  }
}

export { redirectUser };
