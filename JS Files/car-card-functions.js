import { toggleLikeState } from "./ls-real-estate-functions.js";
import { createElement, numberToString } from "./utility-functions.js";

export async function getLikedProperties(userName) {
    try {
        const likedPropertiesList = await fetch("http://localhost:3000/get-liked-properties", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: userName }),
        });
        const likedProperties = await likedPropertiesList.json();
        return likedProperties;
    } catch (error) { }
}

export function isLikedProperty(likedPropertiesList, id) {
    for (let i = 0; i < likedPropertiesList.length; i++) {
        if (likedPropertiesList[i]._id === id) {
            return true;
        }
    }
    return false;
}

export function createCarCard(
    id,
    imgSrc,
    carName,
    price,
    carBrand,
    carType,
    carPower,
    carMileage,
    numberOfSeats,
    isMobileScreen,
    document,
    container,
    likedPropertiesList
) {
    const card = createElement("div", container, { className: "card col-6 col-md-6 col-lg-3", id: "card1" }, document);

    const img = createElement("img", card, { src: imgSrc, alt: carName, className: "card-img-top" }, document)

    const likeButton = createElement("div", card, { className: "like-button" }, document);

    const likeButtonText = createElement("i", likeButton, { className: isLikedProperty(likedPropertiesList, id) ? "fa-solid fa-heart" : "fa-regular fa-heart" }, document);

    likeButton.addEventListener("click", () => { toggleLikeState(likeButtonText, carName) });

    const cardBody = createElement("div", card, { className: "card-body" }, document);

    const cardTitle = createElement("h5", cardBody, { className: "card-title", textContent: carName }, document);

    if (!isMobileScreen) {

        const cardText = createElement("p", cardBody, { className: "card-price", textContent: "$ " + numberToString(price) }, document);

        const brand = createElement("p", cardBody, { className: "brand", textContent: carBrand }, document);

        const type = createElement("p", cardBody, { className: "car-type", textContent: carType }, document);

        const hr1 = createElement("hr", cardBody, {}, document);

        const details = createElement("div", cardBody, { className: "details" }, document);

        const horsepowerIcon = createElement("i", details, { className: "fa-brands fa-superpowers" }, document);

        const power = createElement("p", details, { className: "power", innerHTML: `<span class="num1">${carPower}</span> Hp` }, document)

        const carIcon = createElement("i", details, { className: "fa-solid fa-car" }, document);

        const mileage = createElement("p", details, { className: "mileage", innerHTML: `<span class="num2">${carMileage}</span> kmpl` }, document)

        const speedIcon = createElement("i", details, { className: "fa-solid fa-bolt" }, document);

        const topSpeed = createElement("p", details, { className: "topSpeed", innerHTML: `<span class="num3">${numberOfSeats}</span> Km/h` }, document)

        const hr2 = createElement("hr", cardBody, {}, document);
    } else {

        const someDetails = createElement("div", cardBody, { className: "someDetails" }, document);

        const leftSide = createElement("div", someDetails, { className: "left-side" }, document);

        const cardPrice = createElement("p", leftSide, { className: "card-price", textContent: numberToString(price) }, document);

        const brand = createElement("p", leftSide, { className: "brand", textContent: carBrand }, document);

        const type = createElement("p", leftSide, { className: "car-type", textContent: carType }, document);

        const verticalLine = createElement("div", someDetails, { className: "vertical-line" }, document);

        const rightSide = createElement("div", someDetails, { className: "right-side" }, document);

        const rightSideElements = [bedroom, bathroom, area, "bedroom", "bathroom", "area"];

        const rightSideIcons = [`<i class="fa-solid fa-bed"></i>`, `<i class="fa-solid fa-bath"></i>`, `<i class="fa-solid fa-chart-area"></i>`];

        for (let i = 0; i < 3; i++) {
            const qualityE = createElement("div", rightSide, { className: "quality1", innerHTML: rightSideIcons[i] }, document);
            // here specific refers to either bedroom, bathroom or the area element
            const specific = createElement("p", qualityE, { className: `${rightSideElements[i + 3]}${i === 2 ? "" : "s"}` }, document);
            // adding "s" only if the current element is either bedroom or bathroom as both of them have "bedrooms" and "bathrooms" as classNames while area has "area" as its className.
            const numE = createElement("span", specific, { className: `num${i + 1}`, textContent: `${rightSideElements[i]} ${rightSideElements[i + 3]}${i === 2 ? "" : "s"}` }, document);
        }

        for (let i = 0; i < 2; i++) {
            createElement("hr", cardBody, {}, document)
        }
    }

    const button = createElement("a", cardBody, { className: "btn btn-primary btn1", textContent: "View Details" }, document);

    button.addEventListener("click", () => {
        button.href = `../HTML Files/cars-item-page.html?name=${carName}&type=${carType}`;
    });
}