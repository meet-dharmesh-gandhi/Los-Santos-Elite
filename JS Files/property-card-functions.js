import { toggleLikeState } from "./ls-real-estate-functions.js";
import { createElement, numberToString } from "./utility-functions.js";

const SERVER_URL = "https://los-santos-elite-1.onrender.com/";

export async function getLikedProperties(userName) {
    try {
        const likedPropertiesList = await fetch(`${SERVER_URL}/get-liked-properties`, {
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

export function createPropertyCard(
    id,
    imgSrc,
    propertyName,
    price,
    Locations,
    propertyType,
    bedroom,
    bathroom,
    area,
    isMobileScreen,
    document,
    container,
    likedPropertiesList
) {
    const card = createElement("div", container, { className: "card col-6 col-md-6 col-lg-3", id: "card1" }, document);

    const img = createElement("img", card, { src: imgSrc, alt: propertyName, className: "card-img-top" }, document)

    const likeButton = createElement("div", card, { className: "like-button" }, document);

    const likeButtonText = createElement("i", likeButton, { className: isLikedProperty(likedPropertiesList, id) ? "fa-solid fa-heart" : "fa-regular fa-heart" }, document);

    likeButton.addEventListener("click", () => { toggleLikeState(likeButtonText, propertyName) });

    const cardBody = createElement("div", card, { className: "card-body" }, document);

    const cardTitle = createElement("h5", cardBody, { className: "card-title", textContent: propertyName }, document);

    if (!isMobileScreen) {

        const cardText = createElement("p", cardBody, { className: "card-price", textContent: numberToString(price) }, document);

        const location = createElement("p", cardBody, { className: "location", textContent: Locations }, document);

        const type = createElement("p", cardBody, { className: "property-type", textContent: propertyType }, document);

        const hr1 = createElement("hr", cardBody, {}, document);

        const details = createElement("div", cardBody, { className: "details" }, document);

        const bedIcon = createElement("i", details, { className: "fa-solid fa-bed" }, document);

        const bedrooms = createElement("p", details, { className: "bedrooms", innerHTML: `<span class="num1">${bedroom}</span> Bedrooms` }, document)

        const bathIcon = createElement("i", details, { className: "fa-solid fa-bath" }, document);

        const bathrooms = createElement("p", details, { className: "bathrooms", innerHTML: `<span class="num2">${bathroom}</span> Bathrooms` }, document)

        const areaIcon = createElement("i", details, { className: "fa-solid fa-chart-area" }, document);

        const areas = createElement("p", details, { className: "area", innerHTML: `<span class="num3">${area}</span> Sq Feet` }, document)

        const hr2 = createElement("hr", cardBody, {}, document);
    } else {

        const someDetails = createElement("div", cardBody, { className: "someDetails" }, document);

        const leftSide = createElement("div", someDetails, { className: "left-side" }, document);

        const cardPrice = createElement("p", leftSide, { className: "card-price", textContent: numberToString(price) }, document);

        const location = createElement("p", leftSide, { className: "location", textContent: Locations }, document);

        const type = createElement("p", leftSide, { className: "property-type", textContent: propertyType }, document);

        const verticalLine = createElement("div", someDetails, { className: "vertical-line" }, document);

        const rightSide = createElement("div", someDetails, { className: "right-side" }, document);

        const rightSideElements = [bedroom, bathroom, area];

        const rightSideIcons = [`<i class="fa-solid fa-bed"></i>`, `<i class="fa-solid fa-bath"></i>`, `<i class="fa-solid fa-chart-area"></i>`];

        for (let i = 0; i < 3; i++) {
            const qualityE = createElement("div", rightSide, { className: "quality1", innerHTML: rightSideIcons[i] }, document);
            // here specific refers to either bedroom, bathroom or the area element
            const specific = createElement("p", qualityE, { className: `${rightSideElements[i]}${i === 2 ? "" : "s"}` }, document);
            // adding "s" only if the current element is either bedroom or bathroom as both of them have "bedrooms" and "bathrooms" as classNames while area has "area" as its className.
            const numE = createElement("span", specific, { className: `num${i + 1}`, textContent: `${rightSideElements[i]} ${rightSideElements[i]}${i === 2 ? "" : "s"}` }, document);
        }

        for (let i = 0; i < 2; i++) {
            createElement("hr", cardBody, {}, document)
        }
    }

    const button = createElement("a", cardBody, { className: "btn btn-primary btn1", textContent: "View Details" }, document);

    button.addEventListener("click", () => {
        button.href = `../HTML Files/items-page.html?name=${propertyName}&type=${propertyType}`;
    });
}

export function addRightArrowIcon() {
    let rightArrow = document.createElement("i");
    rightArrow.className = "fa-solid fa-circle-chevron-right";
    rightArrow.style.display = "block";
    document.querySelector(".container3").append(rightArrow);
    let icon1 = document.querySelector(".fa-circle-chevron-right");
    icon1.addEventListener("click", function () {
        let container = document.querySelector(".container3");
        container.scrollBy({
            left: 1330,
            behavior: "smooth",
        });
    });
}

export function addLeftArrowIcon() {
    let leftArrow = document.createElement("i");
    leftArrow.className = "fa-solid fa-circle-chevron-left";
    leftArrow.style.display = "none";
    document.querySelector(".container3").append(leftArrow);
    let icon2 = document.querySelector(".fa-circle-chevron-left");
    let container = document.querySelector(".container3");
    icon2.addEventListener("click", function () {
        container.scrollBy({
            left: -1330,
            behavior: "smooth",
        });
    });
    container.addEventListener("scroll", () => { container.scrollLeft > 0 ? icon2.style.display = "block" : icon2.style.display = "none" });
}
