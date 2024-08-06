import { getUserDetails, setUserDetails } from "./utility-functions.js";
import { setBuilderRating, getCarDetails, getTestDetails, getUserProfile, getOnlyPropertyDetails } from "./cars-item-page-api-endpoints.js";

const urlParams = new URLSearchParams(window.location.search);

let USER_NAME = "";
let userDetails = await getUserDetails();
setUserDetails(userDetails, false, "#userProfilePicture", false, document);
USER_NAME = userDetails.userName;

window.addEventListener("scroll", () => {
    const mansionSection = document.querySelector(".mansion");
    const sectionPosition = mansionSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.5;

    if (sectionPosition < screenPosition) {
        mansionSection.classList.add("visible");
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    await getUserDetails();
    setAddToCartText();
    if (!urlParams.has("test")) {
        await createWebsite(urlParams.get("name"), urlParams.get("type"));
    } else {
        await createTestWebsite(urlParams.get("id"));
    }
});

let carName,
    carType,
    price,
    configuration,
    numberOfSeats,
    brand,
    contact,
    exteriorDescription,
    interiorDescription,
    internalDescription,
    luxuryDescription,
    engineHorsepower,
    engineType,
    brandRating,
    userRating,
    mileage;

const assignValues = async (name, type) => {
    let data = await getCarDetails(name, type);
    data = data[0];
    carName = data["Name"];
    carType = data["Type"];
    price = data["Price"];
    configuration = data["Configuration"];
    numberOfSeats = data["Number Of Seats"];
    brand = data["brand"];
    contact = data["contact"];
    exteriorDescription = data["Exterior Description"];
    interiorDescription = data["Interior Description"];
    internalDescription = data["Internal Description"];
    luxuryDescription = data["Luxury Description"];
    engineHorsepower = data["Engine.Horsepower"];
    engineType = data["Engine.Other Factors"];
    brandRating = data["Brand Rating"];
    data = await getUserProfile(USER_NAME);
    userRating = data[0]["Car Ratings"][carType];
};

const createWebsiteHTML = (carName, numberOfSeats, configuration, brand, carType, engineType, price, contact, brandRating, userRating, exteriorDescription, interiorDescription, internalDescription, luxuryDescription, engineHorsepower, images = Array(5).fill("")) => {
    let body = document.querySelector("body");
    body.innerHTML += `
  <section class="productContainer">
    <div class="container">
        <div class="row">
            <div class="images col-12 col-md-12 col-lg-8">
                <img src="${images[0]}" alt="" height="400px" width="400px" class="bigImage">
                <div class="smallImages">
                    <img src="${images[1] ? "" : ""}" alt="" class="smallImage1" height="200px" width="174px">
                    <img src="${images[2] ? "" : ""}" alt="" class="smallImage2" height="200px" width="174px">
                    <img src="${images[3] ? "" : ""}" alt="" class="smallImage3" height="200px" width="174px">
                    <img src="${images[4] ? "" : ""}" alt="" class="smallImage4" height="200px" width="174px">
                </div>
            </div>
            <div class="productDetails col-12 col-md-12 col-lg-4">
                <h1 class="text-danger">${carName}</h1>
                <p class="byline">by ${carType}</p>
                <ul>
                    <li><span class="text-warning">Price : </span>$${numberToString(price)}</li>
                    <li><span class="text-warning">Configuration : </span>${configuration} BHK</li>
                    <li><span class="text-warning">Location : </span>${numberOfSeats}</li>
                    <li><span class="text-warning">brand : </span>${brand} sq ft.</li>
                    <li><span class="text-warning">Available As : </span>${contact}</li>
                    <li><span class="text-warning">Average brandRating : </span><span class="brandRating-text">${brandRating.toString().slice(0, 3)}</span></li>
                    <li><span class="text-warning">You Rated : <span class="user-brandRating">${userRating > 0 && userRating < 6 ? userRating : ""}</span></li>
                    <li class="ratings-container"></li>
                </ul>
                <button type="button" class=" addToCart btn btn-primary" id="liveToastBtn">Add to Cart</button>
                <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
                    <div id="liveToast" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="toast-header">
                            <strong class="me-auto text-warning fw-bold name">LS Real Estate</strong>
                            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                        <div class="toast-body"></div>
                    </div>
                </div>
                <button class="contactButton btn btn-primary">Contact Us</button>
            </div>
          </div>
      </div>
  </section>
  <section class="description1">
      <h1 class="text-danger">What you get</h1>
      <div class="container">
          <div class="row">
              <p><span class="text-warning">Luxury : </span>${exteriorDescription}</p>
              <p><span class="text-warning">Big brand : </span>${interiorDescription}</p>
              <p><span class="text-warning">Modern : </span>${internalDescription}</p>
              <p><span class="text-warning">More and more : </span>${luxuryDescription}</p>
              <p><span class="text-warning">Nothing else to think : </span>${engineHorsepower}</p>
          </div>
      </div>
  </section>
  <section class="more">
      <h1 class="company text-danger">More from ${carType}</h1>
      <div class="container">
          <div class="row">
              <div class="properties mansion" id="mansion">
                  <div class="container container3"></div>
              </div>
          </div>
      </div>
  </section>
  <section class="contactUs" id="contactUs">
      <h1 class="text-danger">Contact Us</h1>
      <div class="container">
          <div class="row">
              <p>For more information or to schedule a viewing, please contact us
                  <br>
                  Builder Contact Number : ${engineType}
                  <br>
                  Our Email : info@realestate.com
              </p>
          </div>
      </div>
  </section>`;
}

const createWebsite = async (name, type) => {
    await assignValues(name, type);
    createWebsiteHTML(carName, numberOfSeats, configuration, brand, carType, engineType, price, contact, brandRating, userRating, exteriorDescription, interiorDescription, internalDescription, luxuryDescription, engineHorsepower);
    const ratingText = document.querySelector(".brandRating-text");
    const displayedUserRating = document.querySelector(".user-brandRating");

    if (userRating < 1) {
        displayedUserRating.style.display = "none";
    }

    const ratingStarsContainer = document.querySelector(".ratings-container");

    for (let i = 0; i < 5; i++) {
        const ratingStar = document.createElement("i");
        if (i < Math.floor(Number.parseFloat(ratingText.textContent))) {
            ratingStar.className = `fa-solid fa-star brandRating-star brandRating-star-${i + 1
                }`;
        } else if (i + 1 === Math.ceil(Number.parseFloat(ratingText.textContent))) {
            ratingStar.className = `fa-solid fa-star-half-stroke brandRating-star brandRating-star-${i + 1
                }`;
        } else {
            ratingStar.className = `fa-regular fa-star brandRating-star brandRating-star-${i + 1
                }`;
        }
        ratingStar.addEventListener("click", async () => {
            for (let j = 1; j <= i + 1; j++) {
                const ratingStar = document.querySelector(`.brandRating-star-${j}`);
                ratingStar.className = `fa-solid fa-star brandRating-star brandRating-star-${j}`;
            }
            for (let j = i + 2; j <= 5; j++) {
                const ratingStar = document.querySelector(`.brandRating-star-${j}`);
                ratingStar.className = `fa-regular fa-star brandRating-star brandRating-star-${j}`;
            }
            await setBuilderRating(i + 1, carType);
            await assignValues(name, type);
            ratingText.textContent = brandRating.toString().slice(0, 3);
            if (displayedUserRating === null) {
            }
            displayedUserRating.textContent = userRating;
        });
        ratingStarsContainer.appendChild(ratingStar);
    }

    const showCards = async (carType) => {
        let propertyTypes = [],
            propertyNames = [],
            locations = [],
            configurations = [],
            areas = [],
            builderNames = [],
            builderContactNumber = [],
            prices = [],
            states = [],
            images = [];
        const data = await getOnlyPropertyDetails(carType);
        document.querySelector(".container3").innerHTML = "";
        // Creating Given Type Cards
        const records = data.length > 3 ? 3 : data.length - 1;
        let seenI = [];
        for (let j = 0; j < records; j++) {
            let i = getRandomNumber(0, data.length - 1);
            if (!seenI.includes(i) && data[i]["Name"] != name) {
                seenI.push(i);
                propertyTypes.push(data[i]["Type"]);
                propertyNames.push(data[i]["Name"]);
                locations.push(data[i]["Location"]);
                configurations.push(data[i]["Configuration"]);
                areas.push(data[i]["brand"]);
                builderNames.push(data[i]["Builder Name"]);
                builderContactNumber.push(data[i]["Builder Contact Number"]);
                prices.push(data[i]["Price"]);
                states.push(data[i]["contact"]);
                images.push(data[i]["Images"][0]);
            } else {
                j--;
            }
        }

        for (let i = 0; i < propertyTypes.length; i++) {
            createCard(
                propertyTypes[i],
                images[i],
                propertyNames[i],
                prices[i],
                locations[i],
                configurations[i],
                configurations[i],
                areas[i]
            );
        }
    };

    const getRandomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    let contactus = document.querySelector(".contactButton");
    contactus.addEventListener("click", () => {
        window.location.href = "#contactUs";
    });

    document
        .querySelector("#liveToastBtn")
        .addEventListener("click", function () {
            let toastEl = document.querySelector("#liveToast");
            let toast = new bootstrap.Toast(toastEl);
            toast.show();
        });

    let addtocart = document.querySelector(".addToCart");
    let toastBody = document.querySelector(".toast-body");

    addtocart.addEventListener("click", async () => {
        if (addtocart.innerText == "Added !") {
            addtocart.innerText = "Add to Cart";
            toastBody.innerText = "Removed from cart";

        } else if (addtocart.innerText == "Add to Cart") {
            addtocart.innerText = "Added !";
            toastBody.innerText = "Added to cart !";

        }
    });

    showCards(type);
};

const createTestWebsite = async (id) => {
    const websiteDetails = await getTestDetails(id);
    createWebsiteHTML(websiteDetails["Name"], websiteDetails["Location"], websiteDetails["Configuration"], websiteDetails["brand"], websiteDetails["Builder Name"], websiteDetails["Builder Contact Number"], websiteDetails["Price"], websiteDetails["contact"], websiteDetails["brandRating"], 0, websiteDetails["Luxury Description"].slice(3), websiteDetails["brand Description"].slice(3), websiteDetails["Modern Description"].slice(3), websiteDetails["More Description"].slice(3), websiteDetails["Nothing Description"].slice(3), websiteDetails["Images"]);

    const ratingText = document.querySelector(".brandRating-text");
    const displayedUserRating = document.querySelector(".user-brandRating");
    const userRating = 0;

    if (userRating < 1) {
        displayedUserRating.style.display = "none";
    }

    const ratingStarsContainer = document.querySelector(".ratings-container");

    for (let i = 0; i < 5; i++) {
        const ratingStar = document.createElement("i");
        if (i < Math.floor(Number.parseFloat(ratingText.textContent))) {
            ratingStar.className = `fa-solid fa-star brandRating-star brandRating-star-${i + 1
                }`;
        } else if (i + 1 === Math.ceil(Number.parseFloat(ratingText.textContent))) {
            ratingStar.className = `fa-solid fa-star-half-stroke brandRating-star brandRating-star-${i + 1
                }`;
        } else {
            ratingStar.className = `fa-regular fa-star brandRating-star brandRating-star-${i + 1
                }`;
        }
        ratingStar.addEventListener("click", async () => {
            for (let j = 1; j <= i + 1; j++) {
                const ratingStar = document.querySelector(`.brandRating-star-${j}`);
                ratingStar.className = `fa-solid fa-star brandRating-star brandRating-star-${j}`;
            }
            for (let j = i + 2; j <= 5; j++) {
                const ratingStar = document.querySelector(`.brandRating-star-${j}`);
                ratingStar.className = `fa-regular fa-star brandRating-star brandRating-star-${j}`;
            }
            ratingText.textContent = websiteDetails["brandRating"].toString().slice(0, 3);
            displayedUserRating.textContent = userRating;
        });
        ratingStarsContainer.appendChild(ratingStar);
    }
}

function showCart() {
    window.location.href = `../HTML Files/show-cart-page.html`;
}

const getCart = async (user) => {
    try {
        const response = await fetch("http://localhost:3000/show-cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userName: user }),
        });
        let data = await response.json();
        data = data["cart"];
        return data;
    } catch (error) {
        console.log(error);
    }
};

const inCart = (item, cart) => {
    for (let i = 0; i < cart["building"].length; i++) {
        let element = cart["building"][i];
        if (item === element) {
            return true;
        }
    }
    return false;
};

const setAddToCartText = async () => {
    let userCart = await getCart(USER_NAME);
    let addtocart = document.querySelector(".addToCart");
    let toastBody = document.querySelector(".toast-body");
    if (inCart(urlParams.get("name"), userCart)) {
        addtocart.innerText = "Added !";
        value = "added";
        toastBody.innerText = "Added to cart !";
    }
};