const urlParams = new URLSearchParams(window.location.search);
const nextPage = urlParams.get("goto");


let animationEnd = document.querySelector(".image img");
animationEnd.addEventListener("animationend", () => {
  animationEnd.style.animation = "moveAstronaut 4s infinite";
});

const username = document.getElementById("userName");
const password = document.getElementById("password");
const signUpButon = document.querySelector(".sign-up");
const signInButton = document.querySelector(".sign-in");
if (signInButton !== null) {
  signInButton.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = `../HTML Files/sign-in-page.html?goto=${nextPage}`;
  });
}

if (signUpButon !== null) {
  signUpButon.addEventListener("click", () => {
    if (
      username.value === "" ||
      username.value == " " ||
      password.value === "" ||
      password.value == " "
    ) {
      alert("Please fill in all fields");
      return;
    }
    addNewUser(username.value, password.value);
    username.value = "";
    password.value = "";
  });
}

const addNewUser = async (username, password) => {
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
        "Email Address": "",
        Name: "",
        "Phone Number": "",
        OTP: { OTP: "", expiresAt: new Date(), createdAt: new Date() }
      }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong!! Status: " + response.status);
    }
    const data = await response.json();
    if (data === "Username Exists!!") {
      alert("Username Exists!!");
    } else {
      window.location.href = `../HTML Files/sign-in-page.html?new-account=true&goto=${nextPage}`;
    }
  } catch (error) {
    console.error("Error adding credentials: ", error);
  }
};

export { addNewUser };