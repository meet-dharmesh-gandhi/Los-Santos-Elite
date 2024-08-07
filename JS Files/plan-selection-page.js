import { getUserDetails } from "./utility-functions.js";

const urlParams = new URLSearchParams(window.location.search);
const userName = urlParams.get("username");
const paymentStatus = urlParams.has("status") ? urlParams.get("status") : "";

let userDetails = await getUserDetails();

const setPremiumType = async (i) => {
    try {
        const response = await fetch("https://los-santos-elite-2gyo.onrender.com/set-premium-type", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ premiumType : i, username : (userDetails.userName) }),
        });
        if (!response.ok) {
            alert("please try again!!");
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.log(error);
    }
}

const activateUserWallet = async () => {
    const USER_NAME = userDetails.userName;
    console.log("USER_NAME: " + USER_NAME);
    try {
        const response = await fetch("https://los-santos-elite-2gyo.onrender.com/activate-e-wallet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username : USER_NAME }),
        });
        if (!response.ok) {
            throw new Error("Something went wrong");
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

const respondToStatus = async (status) => {
    if (status.split(" ")[1] === "Successful") {
        await activateUserWallet();
        const premiumNumber = status.split(" ")[2] === "4020400" ? 3 : status.split(" ")[2] === "2261500" ? 2 : 1
        setPremiumType(premiumNumber);
        window.location.href = "../HTML Files/sell-page.html";
    } else if (status.split(" ")[1] === "Failed") {
      alert("Payment Failed!! Please Try Again!!");
    }
}

await respondToStatus(paymentStatus);

const payPremium = (USD) => {
    const reply = window.confirm(
        `Are you sure, you want to pay $${USD}??`
      );
      console.log(Math.floor(USD * 83.76));
      window.location.href = `https://los-santos-elite-2gyo.onrender.com/pay-premium/${Math.floor(USD * 83.76) * 100}`;
}

let buyPlan1 = document.querySelector(".buy1")
buyPlan1.addEventListener("click", async () => {
    payPremium(50);
});

let buyPlan2 = document.querySelector(".buy2");
buyPlan2.addEventListener("click", () => {
    payPremium(480);
});

let buyPlan3 = document.querySelector(".buy3");
buyPlan3.addEventListener("click", () => {
    payPremium(270);
});
