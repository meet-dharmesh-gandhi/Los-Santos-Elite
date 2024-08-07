import { getUserDetails } from "./utility-functions.js";

let USER_NAME = "";
let userDetails;
const loader = document.querySelector("#loader");

document.addEventListener("DOMContentLoaded", () => {loader.style.display = "none";})

userDetails = await getUserDetails();
console.log(userDetails);
USER_NAME = userDetails.userName;
document.querySelector("#userProfilePicture").src = userDetails.userProfilePicture;

document.onreadystatechange = function() {
  if (document.readyState !== "complete") {
      document.querySelector("body").style.visibility = "hidden";
      document.querySelector("#loader").style.visibility = "visible";
  } else {
      document.querySelector("#loader").style.display = "none";
      document.querySelector("body").style.visibility = "visible";
  }
};

const urlParams = new URLSearchParams(window.location.search);
let paymentResult;

const getCart = async (user) => {
    try {
        loader.style.display = "block";
        const response = await fetch("https://los-santos-elite-2gyo.onrender.com/show-cart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName: user }),
        });
        let data = await response.json();
        data = data["cart"];
        loader.style.display = "none";
        return data;
    } catch (error) {
        console.log(error);
    }
};

const updateTransactionHistory = async (amounts, quantities) => {
  loader.style.display = "block";
  const date = new Date();
  const fullDate = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
  try {
    const response = await fetch ("https://los-santos-elite-2gyo.onrender.com/update-transaction-history", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ amounts, userName : USER_NAME, quantities, fullDate }),
    })
  } catch (error) {
    console.log(error);
  }
  loader.style.display = "none";
}

const deleteCart = async () => {
    loader.style.display = "block";
    try {
        const response = await fetch("https://los-santos-elite-2gyo.onrender.com/delete-cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userName: USER_NAME }),
        })
    } catch (error) {
        console.log(error);
    }
    loader.style.display = "none";
}

const getListOfPrices = async (listOfPrices) => {
  loader.style.display = "block";
  try {
    const response = await fetch("https://los-santos-elite-2gyo.onrender.com/get-list-of-prices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ listOfPrices }),
    })
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
  loader.style.display = "none";
}

try {
  paymentResult = urlParams.get("result");
} catch (error) {
  paymentResult = "pending";
}

if (paymentResult === "success") {
  loader.style.display = "block";
  const userCart = await getCart(USER_NAME);
  console.log(userCart["car"].concat(userCart["building"]));
  const amounts = await getListOfPrices(userCart["car"].concat(userCart["building"]));
  const userCartLength = userCart["car"].length + userCart["building"].length;
  let quantities = new Array(userCartLength);
  quantities = quantities.fill(1, 0, userCartLength);
  console.log(quantities);
  if (userCartLength != 0) {
    await updateTransactionHistory(amounts, quantities);
    await deleteCart();
  }
  loader.style.display = "none";
}

const checkoutButton = document.querySelector(".checkout-button");
const propertyNames = [],
  prices = [];
let userCart, totalPrice = 100;

checkoutButton.addEventListener("click", () => {
  const reply = window.confirm(
    `Are you sure, you want to pay $${formatNumber(
      Math.ceil(1.11 * totalPrice)
    )}??`
  );
  console.log(reply);
  if (reply) {
    window.location.href = `https://los-santos-elite-2gyo.onrender.com/pay/${Math.ceil(1.11 * totalPrice)}`;
  }
});

function extractOtherThanNumbers(numberString) {
  numberString = numberString.toString().split("");
  let stringNumber = [];
  for (let i = 0; i < numberString.length; i++) {
    if (
      !(
        numberString[i].charCodeAt(0) >= 48 &&
        numberString[i].charCodeAt(0) <= 57
      ) &&
      numberString[i] != " " &&
      numberString[i] != "."
    ) {
      stringNumber.push(numberString[i]);
    }
  }
  return stringNumber.join("");
}

const trimString = (numberString, dir) => {
  if (dir === "left") {
    while (numberString[0] == "0") {
      numberString = numberString.slice(0, -1);
    }
  } else if (dir === "right") {
    while (numberString[numberString.length - 1] == "0") {
      numberString = numberString.slice(0, -1);
    }
  }
  return numberString;
};

const numberToString = (number) => {
  let numberString = "";
  number = number.toString();
  //      number = number.split(".")[0];
  if (number.slice(number.length - 6, number.length) === "000000") {
    numberString = number.slice(0, number.length - 6) + " M";
  } else if (number.split(".")[0].length > 6) {
    numberString =
      trimString(
        number.split(".")[0].slice(0, number.split(".")[0].length - 6),
        "left"
      ) +
      "." +
      trimString(
        number
          .split(".")[0]
          .slice(number.split(".")[0].length - 6, number.split(".")[0].length),
        "right"
      );
    if (number.split(".").length > 1) {
      numberString += number.split(".")[1];
    }
    numberString += " M";
  } else if (number.slice(number.length - 3, number.length) === "000") {
    numberString = number.slice(0, number.length - 3) + " K";
  } else {
    numberString = number;
  }
  return numberString;
};

const formatNumber = (number) => {
  number = numberToString(number);
  const otherChars = extractOtherThanNumbers(number);
  number = Number.parseFloat(number);
  const numberArray = number.toString().split(".");
  const nonDecimalValues = numberArray[0].toString().split("").reverse();
  let formattedString = [],
    lastIndex = 0;
  for (let i = 0; i < nonDecimalValues.length; i++) {
    if (i % 3 === 0 && i != 0) {
      formattedString[lastIndex] = ",";
      lastIndex++;
      formattedString[lastIndex] = nonDecimalValues[i];
    } else {
      formattedString[lastIndex] = nonDecimalValues[i];
    }
    lastIndex++;
  }
  if (numberArray.length > 1) {
    return (
      formattedString.reverse().join("") +
      "." +
      numberArray[1] +
      " " +
      otherChars
    );
  } else {
    return formattedString.reverse().join("") + " " + otherChars;
  }
};

const getUserCart = async () => {
  loader.style.display = "block";
  console.log(USER_NAME);
  try {
    const response = await fetch("https://los-santos-elite-2gyo.onrender.com/show-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName: USER_NAME }),
    });
    let data = await response.json();
    console.log(data);
    data = data["cart"];
    userCart = data;
    console.log(data);
  } catch (error) {
    console.log(error);
  }
  loader.style.display = "none";
};

const getCartPrices = async () => {
  loader.style.display = "block";
  for (let i = 0; i < Object.keys(userCart).length; i++) {
    userCart[Object.keys(userCart)[i]].forEach((element) => {
      propertyNames.push(element);
    });
  }
  try {
    const response = await fetch("https://los-santos-elite-2gyo.onrender.com/get-specifics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Name: { $in: propertyNames } }),
    });
    let data = await response.json();
    data.forEach((element) => {
      prices.push(element["Price"]);
    });
    prices.forEach((element) => {
      totalPrice += element;
    });
  } catch (error) {
    console.log(error);
  }
  loader.style.display = "none";
};

const inArray = (item, array) => {
  for (let i = 0; i < array.length; i++) {
    let element = array[i];
    if (element === item) {
      return true;
    }
  }
  return false;
};

const getElementDetails = async (propertyNames) => {
  loader.style.display = "block";
  try {
    const response = await fetch("https://los-santos-elite-2gyo.onrender.com/get-specifics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Name: { $in: propertyNames } }),
    });
    let data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
  loader.style.display = "none";
};

const showCart = async () => {
  loader.style.display = "block";
  const elementDetails = await getElementDetails(propertyNames);
  elementDetails.forEach((element) => {
    const { Name, Configuration, Type, State, Price } = element;
    createItemCard(Name, Configuration, Type, State, Price);
    totalPrice += Price;
  });
  const subTotal = document.querySelector("#sub-total");
  const tax = document.querySelector("#tax");
  const convenienceFees = document.querySelector("#convenience-fees");
  const totalAmount = document.querySelector("#total-amount");
  subTotal.innerHTML = totalPrice;
  tax.innerHTML = Math.ceil(totalPrice / 10);
  convenienceFees.innerHTML = Math.ceil(totalPrice / 100);
  totalAmount.innerHTML = Math.ceil(1.11 * totalPrice);
  loader.style.display = "none";
};

await getUserCart();
await getCartPrices();
await showCart();

function createItemCard(
  propertyName,
  configuration,
  propertyType,
  state,
  price
) {
  let box = document.querySelector(".box");
  box.innerHTML += `
  <div class="cards">
  <div class="image">
    <img src="./images/mansion.jpg" alt="">
  </div>
  <div class="details">
    <h1>${propertyName}</h1>
    <p class="area">Example Area, Los Santos</p>
    <p class="configurations">Configurations</p>
    <ul>
      <li>${configuration}</li>
      <li>${propertyType}</li>
      <li>${state}</li>
    </ul>
    <hr class="line2">
    <div class="price-button">
    <button class="remove-button ${propertyName.replaceAll(
      " ",
      "-"
    )}">Remove from Cart</button>
    <h4 class="cardPrice">${price}</h4>
    </div>
  </div>
  </div>
  `;
}

const removeFromCart = async (name) => {
  loader.style.display = "block";
  try {
    const response = await fetch("https://los-santos-elite-2gyo.onrender.com/remove-from-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: USER_NAME,
        type: "building",
        name,
      }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
  } catch (error) {
    console.error("Error while removing from cart: ", error);
  }
  loader.style.display = "none";
};

const removeFromCartButtons = document.querySelectorAll(".remove-button");

removeFromCartButtons.forEach((element) => {
  element.addEventListener("click", async () => {
    loader.style.display = "block";
    const setPropertyName = element.classList[1].replaceAll("-", " ");
    console.log(setPropertyName);
    const reply = confirm(
      `Are you sure to delete ${setPropertyName} from your cart??`
    );
    if (reply) {
      await removeFromCart(setPropertyName);
      location.reload();
    }
    loader.style.display = "none";
  });
});
