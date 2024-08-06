// pending tasks:
// 1. show liked properties with a fa-solid heart
// 2. stop anyone from accessing any of the web pages from in-between, redirect to sign in page if status is 403
// 3. link the profile page

import { addLeftArrowIcon, addRightArrowIcon, createPropertyCard } from "./property-card-functions.js";
import { createElement, getElement, getRandomNumber, getSibling, load, redirectTo, unLoad } from "./utility-functions.js";

const SERVER_URL = "https://los-santos-elite-1.onrender.com/";


export function toggleLikeState(likeButtonText, propertyName) {
    if (likeButtonText.classList.contains("fa-regular")) {
        likeButtonText.classList.remove("fa-regular");
        likeButtonText.classList.add("fa-solid");
        addToWishlist(propertyName);
    } else {
        likeButtonText.classList.remove("fa-solid");
        likeButtonText.classList.add("fa-regular");
        removeFromWishlist(propertyName);
    }
    likeButtonText.classList.toggle("liked");
}

export async function addToWishlist(propertyName) {
    try {
        const userName = document.getElementById("user-name");
        const response = await fetch(`${SERVER_URL}/add-to-wishlist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userName: userName.textContent, propertyName }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function removeFromWishlist(propertyName) {
    try {
        const userName = document.getElementById("user-name");
        const response = await fetch(`${SERVER_URL}/remove-from-wishlist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userName: userName.textContent, propertyName }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

export function toggleCaptionsState(captions) {
    captions.classList.toggle("caption-p-display");
}

export function getTotalHeight(heights, multipliers, document) {
    let totalHeight = 0;
    for (let i = 0; i < heights.length; i++) {
        totalHeight += document.querySelector(heights[i]).offsetHeight * multipliers[i];
    }
    return totalHeight;
}

export function typeUserName(listOfHeights, document, multipliers, window, username, userNameElement, index, variableName, nameLength, readyToGo) {
    let totalHeight = getTotalHeight(listOfHeights, multipliers, document);
    if (window.scrollY >= totalHeight || readyToGo) {
        readyToGo = true;
        userNameElement.textContent += username[index];
        index++;
        if (index >= nameLength) {
            clearInterval(variableName);
        }
    }
    return [index, readyToGo];
}

export function clickToGoTo(toClick, toGo) {
    document.querySelector(toClick).addEventListener("click", () => {
        window.location.href = toGo;
        document.querySelector(toGo).click();
    });
}

export function onScreenScroll(navbar, navbar2, logo, heights, multipliers, window, scrollPos, document) {
    var totalHeight = getTotalHeight(heights, multipliers, document);

    if (window.scrollY >= totalHeight) {
        document.querySelector(logo).classList.add("hidden");
        document.querySelector(navbar2).style.display = "block";
    } else {
        document.querySelector(logo).classList.remove("hidden");
        document.querySelector(navbar2).style.display = "none";
    }
    if (window.pageYOffset >= totalHeight && (document.body.getBoundingClientRect()).top > scrollPos) {
        document.querySelector(navbar).classList.add("fixed");

    } else {
        document.querySelector(navbar).classList.remove("fixed");
    }
    scrollPos = (document.body.getBoundingClientRect()).top;
    return scrollPos;
}

export async function getAllPropertyDetails(loader) {
    loader.style.display = "block";
    try {
        const response = await fetch(`${SERVER_URL}/get-property-details`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ Type: { $exists: true } }),
        });
        if (!response.ok) {
            throw new Error("Something went wrong");
        }
        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching details: ", error);
        console.log(error.message);
    }
    loader.style.display = "none";
};

export async function getPropertyDetails(propertyType, loader) {
    loader.style.display = "block";
    try {
        const response = await fetch(`${SERVER_URL}/get-property-details`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ Type: propertyType }),
        });
        if (!response.ok) {
            throw new Error("Something went wrong");
        }
        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching details: ", error);
        console.log(error.message);
    } finally {
        loader.style.display = "none";
    }
};

export async function filterProperties(
    type,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    minRating,
    maxRating,
    builderName,
    configuration,
    dealType,
    location,
) {
    try {
        const response = await fetch(`${SERVER_URL}/filter-properties`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type,
                minPrice,
                maxPrice,
                minArea,
                maxArea,
                minRating,
                maxRating,
                builderName,
                configuration,
                dealType,
                location,
            }),
        });
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
    }
};

export function showResults(document, numberOfResultsElement, dataLength) {
    const numberOfResults = document.querySelector(numberOfResultsElement);

    numberOfResults.textContent = `Showing ${dataLength} result(s)`;

    if (dataLength == 0) {
        numberOfResults.style.color = "red";
    } else {
        numberOfResults.style.color = "green";
    }
}

export function addNewData(
    newData,
    document,
    numberOfResultsElement,
    container,
    tabContents,
    tab
) {
    // i can add new data by taking the tabContents and the two sub categories as params and then assign them accordingly and then finally return the updated tabContents
    const paramsList = ["id", "propertyTypes", "propertyNames", "locations", "configurations", "areas", "builderNames", "builderContactNumber", "prices", "states", "images"];

    container.innerHTML = "";

    const keys = ["_id", "Type", "Name", "Location", "Configuration", "Area", "Builder Name", "Builder Contact Number", "Price", "State", "Images", "Rating", "Luxury Description", "Area Description", "Modern Description", "More Description", "Nothing Description"];

    for (let i = 0; i < paramsList.length; i++) {
        tabContents[paramsList[i]][tab].splice();
    }

    for (let i = 0; i < newData.length; i++) {
        for (let j = 0; j < paramsList.length; j++) {
            tabContents[paramsList[j]][tab].push(newData[i][newData[i].keyAt(j)]);
        }
    }

    showResults(document, numberOfResultsElement, newData.length);

    return tabContents;
};

function showAlien(messageText, container, document) {
    const alienContainer = createElement("div", container, { className: "alien-container" }, document);
    const alien = createElement("div", alienContainer, { className: "alien" }, document);
    const alienImg = createElement("img", alien, { src: "../Other Media/images/astronaut.png", alt: "Astronaut", className: "alien-img" }, document);
    const message = createElement("p", alien, { className: "alien-message", innerHTML: messageText }, document);
}

export function toggleAlienState(alienVisible, dataLength, container, document) {
    if (alienVisible && dataLength != 0) {
        return false;
    } else if (!alienVisible && dataLength == 0) {
        showAlien("Yay!! You Found Me!!", container, document);
        return true;
    }
}

export async function showAllCards(loader, tabContents, document, numberOfResultsElement, isMobileScreen, container, clickedTab, tabs, clickedTabString, tabStrings, likedPropertiesList) {
    loader.style.display = "block";

    if (tabContents.propertyTypes.All.length == 0) {
        const data = await getAllPropertyDetails(loader);

        const len = data.length;
        let indices = [];

        for (let i = 0; i < len; i++) {
            indices.push(i);
        }

        while (indices.length > 0) {
            let i = getRandomNumber(0, indices.length - 1);
            tabContents.indices.All.push(indices[i]);
            indices.splice(i, 1);
        }

        tabContents = addNewData(data, document, numberOfResultsElement, container, tabContents, "All");
    }

    container.innerHTML = "";

    for (let i = 0; i < tabContents.indices.All.length; i++) {
        createPropertyCard(
            tabContents.id.All[tabContents.indices.All[i]],
            tabContents.images.All[tabContents.indices.All[i]],
            tabContents.propertyNames.All[tabContents.indices.All[i]],
            tabContents.prices.All[tabContents.indices.All[i]],
            tabContents.locations.All[tabContents.indices.All[i]],
            tabContents.propertyTypes.All[tabContents.indices.All[i]],
            tabContents.configurations.All[tabContents.indices.All[i]],
            tabContents.configurations.All[tabContents.indices.All[i]],
            tabContents.areas.All[tabContents.indices.All[i]],
            isMobileScreen,
            document,
            container,
            likedPropertiesList
        );
    }

    if (tabContents.indices.All.length > 0) {
        addLeftArrowIcon();
        addRightArrowIcon();
    }

    showResults(document, numberOfResultsElement, tabContents.propertyNames.All.length);

    loader.style.display = "none";

    clickedTab = tabs[0];
    clickedTabString = tabStrings[0];
}

export async function showCards(type, loader, tabContents, document, numberOfResultsElement, isMobileScreen, container, clickedTab, tabs, clickedTabString, tabStrings, index, likedPropertiesList) {
    load(loader);

    const data = await getPropertyDetails(type, loader);

    tabContents = addNewData(data, document, numberOfResultsElement, container, tabContents, tabs[index]);

    container.innerHTML = "";

    for (let i = 0; i < tabContents.propertyNames.Other.length; i++) {
        createPropertyCard(
            tabContents.id.Other[i],
            tabContents.images.Other[i],
            tabContents.propertyNames.Other[i],
            tabContents.prices.Other[i],
            tabContents.locations.Other[i],
            tabContents.propertyTypes.Other[i],
            tabContents.configurations.Other[i],
            tabContents.configurations.Other[i],
            tabContents.areas.Other[i],
            isMobileScreen,
            document,
            container,
            likedPropertiesList
        );
    }
    if (tabContents.propertyNames.Other.length > 0) {
        addRightArrowIcon();
        addLeftArrowIcon();
    }

    showResults(document, numberOfResultsElement, tabContents.propertyNames.Other.length)

    unLoad(loader);

    clickedTab = tabs[index];
    clickedTabString = tabStrings[index];
};

export function showSearchedCards(loader, tabContents, document, numberOfResultsElement, isMobileScreen, container, alienVisible, clickedTab, tabs, clickedTabString, tabStrings, likedPropertiesList) {
    load(loader);

    container.innerHTML = "";

    for (let i = 0; i < tabContents.propertyTypes.Searched.length; i++) {
        createPropertyCard(
            tabContents.id.Searched[i],
            tabContents.images.Searched[i],
            tabContents.propertyNames.Searched[i],
            tabContents.prices.Searched[i],
            tabContents.locations.Searched[i],
            tabContents.propertyTypes.Searched[i],
            tabContents.configurations.Searched[i],
            tabContents.configurations.Searched[i],
            tabContents.areas.Searched[i],
            isMobileScreen,
            document,
            container,
            likedPropertiesList
        );
    }

    if (tabContents.propertyTypes.Searched.length > 0) {
        addLeftArrowIcon();
        addRightArrowIcon();
    }

    showResults(document, numberOfResultsElement, tabContents.propertyTypes.Searched.length);

    alienVisible = toggleAlienState(alienVisible, tabContents.propertyNames.Searched.length, container, document);

    redirectTo("#searched-tab");

    unLoad(loader);

    clickedTab = tabs[5];
    clickedTabString = tabStrings[5];
};

export async function getSearchedProperties(Searched) {
    try {
        const response = await fetch(`${SERVER_URL}/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ Searched }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export async function onSearchButtonClicked(loader, input, document, searchedTab, numberOfResultsElement, tabContents, container) {
    load(loader);

    const checkElement = getElement(`${input}-tab`, document);

    const checkElementMinusS = getElement(`${input.slice(0, -1)}-tab`, document);
    if (checkElement !== null && checkElement !== undefined) {
        redirectTo(`#${input}-tab`);
        checkElement.click();
    } else if (checkElementMinusS !== null && checkElementMinusS !== undefined) {
        redirectTo(`#${input.slice(0, -1)}-tab`);
        checkElementMinusS.click();
    } else if (input != "" || input != " ") {
        const data = await getSearchedProperties(input);
        if (data.length > 0) {
            tabContents = addNewData(data, document, numberOfResultsElement, container, tabContents, "Searched");
        } else {
            ({
                Id: tabContents.id.Searched,
                Type: tabContents.propertyTypes.Searched,
                Name: tabContents.propertyNames.Searched,
                Location: tabContents.locations.Searched,
                Configuration: tabContents.configurations.Searched,
                Area: tabContents.areas.Searched,
                "Builder Name": tabContents.builderNames.Searched,
                "Builder Contact Number": tabContents.builderContactNumber.Searched,
                Price: tabContents.prices.Searched,
                State: tabContents.states.Searched,
                Images: tabContents.images.Searched
            } = {
                Id: [],
                Type: [],
                Name: [],
                Location: [],
                Configuration: [],
                Area: [],
                "Builder Name": [],
                "Builder Contact Number": [],
                Price: [],
                State: [],
                Images: []
            })
        }
        searchedTab.click();
    }

    unLoad(loader);
}

export function addOptions(elementArrays, parentElements, configs, document, appliedFilters) {
    for (let i = 0; i < elementArrays.length; i++) {
        const elementArray = elementArrays[i];
        const parentElement = parentElements[i];
        const config = configs[i];
        const category = Object.keys(appliedFilters)[i];
        for (let j = 0; j < elementArray.length; j++) {
            const element = elementArray[j];
            const option = createElement("p", parentElement, { className: "dropdown-item", textContent: `${element}${config ? " BHK" : ""}` }, document);
            option.addEventListener("click", () => {
                createNewFilter(option.textContent, category, appliedFilters, document)
            })
        }
    }
};

export async function getAttributes(attributes) {
    try {
        const result = await fetch(`${SERVER_URL}/get-unique-values`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ values: attributes }),
        });
        const data = await result.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export async function createOptions(loader, document, appliedFilters) {
    load(loader);

    const [BuilderNames, Configurations, States, Locations] = await getAttributes(["Builder Name", "Configuration", "State", "Location"]);

    const builder = getElement(".builder", document),
        configuration = getElement(".configuration", document),
        dealType = getElement(".dealType", document),
        location = getElement(".location", document);

    addOptions([BuilderNames, Configurations, States, Locations], [builder, configuration, dealType, location], [false, true, false, false], document, appliedFilters);

    unLoad(loader);
};

export function createNewFilter(textContent, category, appliedFilters, document) {
    const selectedFilters = getElement(".selectedFilters", document);
    const newFilter = createElement("div", selectedFilters, { className: "selected", textContent: textContent }, document);
    const closeButton = createElement("button", newFilter, { className: "btn-close btn-close2", type: "button" }, document);
    appliedFilters[category].push(textContent);
    closeButton.addEventListener("click", () => {
        newFilter.remove();
        appliedFilters[category].splice(appliedFilters[category].indexOf(textContent), 1);
    });
}

export function updateFilters(filters, document, appliedFilters) {
    filters.forEach((element) => {
        element.addEventListener("click", () => {
            const dropdownTitle = element.parentNode.parentNode.firstElementChild.textContent;
            // the element is a p tag inside a ul tag and hence element.parentNode.parentNode refers to the dropdown button and the ul's parent
            // whose first child is the dropdown button which contains the text (builder name, configuration, location and state)
            if (!appliedFilters[dropdownTitle].includes(element.textContent)) {
                createNewFilter(element.textContent, dropdownTitle, appliedFilters, document);
            }
        });
    });
}

export function extractNumbers(numberString, check) {
    let stringNumber = "";
    if (check) {
        for (let i = 0; i < numberString.length; i++) {
            if (numberString[i].charCodeAt(0) >= 48 && numberString[i].charCodeAt(0) <= 57) {
                stringNumber += numberString[i];
            } else if (numberString[i] == "M" || numberString[i] == "m") {
                stringNumber += "000000";
            } else if (numberString[i] == "K" || numberString[i] == "k") {
                stringNumber += "000";
            }
        }
    } else {
        for (let i = 0; i < numberString.length; i++) {
            if (
                numberString[i].charCodeAt(0) >= 48 &&
                numberString[i].charCodeAt(0) <= 57
            ) {
                stringNumber += numberString[i];
            }
        }
    }
    if (stringNumber == "") {
        return "";
    }
    return parseFloat(stringNumber, 10);
}

export function extractNumbersFromArray(array) {
    let arrayOfNumbers = [];
    array.forEach((element) => {
        arrayOfNumbers.push(extractNumbers(element, false));
    });
    return arrayOfNumbers;
}

export async function applyFilter(loader, appliedFilters, alienVisible, document, numberOfResultsElement, clickedTabString, container, filteredTab, tabContents) {
    load(loader);

    const minPrice = extractNumbers(document.querySelector(".minPriceInput").textContent, true),
        maxPrice = extractNumbers(document.querySelector(".maxPriceInput").textContent, true),
        minArea = extractNumbers(document.querySelector(".minAreaInput").textContent, true),
        maxArea = extractNumbers(document.querySelector(".maxAreaInput").textContent, true),
        minRating = extractNumbers(document.querySelector(".minRatingInput").textContent, true),
        maxRating = extractNumbers(document.querySelector(".maxRatingInput").textContent, true),
        builderName = appliedFilters["Builder"],
        configuration = extractNumbersFromArray(appliedFilters["Configuration"]),
        dealType = appliedFilters["Deal Type"],
        location = appliedFilters["Location"];

    if (minPrice >= maxPrice || minArea >= maxArea || minRating > maxRating) {
        if (alienVisible) {
            alienVisible = false;
        }
        document.querySelector(".container3").innerHTML = "";
        const parameter = minPrice >= maxPrice ? "Price" : minArea >= maxArea ? "Area" : minRating > maxRating ? "Rating" : "";

        showAlien(`Check your Math Buddy!!<br>Minimum ${parameter} cannot be greater than Maximum ${parameter}!!`, container, document);

        showResults(document, numberOfResultsElement, 0);

        const numberOfResults = document.querySelector(".number-of-results");

        numberOfResults.textContent = "Showing 0 result(s)";

        numberOfResults.style.color = "red";

        alienVisible = true;

        return;
    }

    let data = await filterProperties(
        clickedTabString === "All" || clickedTabString === "Filtered" ? "All" : clickedTabString,
        minPrice,
        maxPrice,
        minArea,
        maxArea,
        minRating,
        maxRating,
        builderName,
        configuration,
        dealType,
        location
    );

    tabContents = addNewData(data, document, numberOfResultsElement, container, tabContents, "Filtered");

    if (data.length === 0) {
        showAlien("Yay!! You Found Me!!", container, document);
        alienVisible = true;
    } else if (clickedTabString == "All" || clickedTabString == "Filtered") {
        filteredTab.click();
    } else {
        showFilteredCards(container, tabContents, isMobileScreen, document, numberOfResultsElement, alienVisible);
    }

    redirectTo("#filtered-tab");

    unLoad(loader);
}

export function showFilteredCards(container, tabContents, isMobileScreen, document, numberOfResultsElement, alienVisible, clickedTab, tabs, clickedTabString, tabStrings, likedPropertiesList) {
    container.innerHTML = "";

    for (let i = 0; i < tabContents.propertyTypes.Filtered.length; i++) {
        createPropertyCard(
            tabContents.id.Filtered[i],
            tabContents.images.Filtered[i],
            tabContents.propertyNames.Filtered[i],
            tabContents.prices.Filtered[i],
            tabContents.locations.Filtered[i],
            tabContents.propertyTypes.Filtered[i],
            tabContents.configurations.Filtered[i],
            tabContents.configurations.Filtered[i],
            tabContents.areas.Filtered[i],
            isMobileScreen,
            document,
            container,
            likedPropertiesList
        );
    }

    if (tabContents.propertyTypes.Filtered.length > 0) {
        addRightArrowIcon();
        addLeftArrowIcon();
    }

    showResults(document, numberOfResultsElement, tabContents.propertyTypes.Filtered.length);

    toggleAlienState(alienVisible, tabContents.propertyTypes.Filtered.length, container, document);

    clickedTab = tabs[4];
    clickedTabString = tabStrings[4];
};

export async function setExtremeValues(minPriceInput, maxPriceInput, minAreaInput, maxAreaInput, document) {
    const values = await fetch(`${SERVER_URL}/get-extreme-values`);
    const extremeValues = await values.json();
    getElement(minPriceInput, document).textContent = extremeValues[0].minPrice;
    getElement(maxPriceInput, document).textContent = extremeValues[0].maxPrice;
    getElement(minAreaInput, document).textContent = extremeValues[0].minArea;
    getElement(maxAreaInput, document).textContent = extremeValues[0].maxArea;
}

export function applyAndShowFilters(filteredTab, filterLogo, filterButton) {
    filteredTab.click();
    filterLogo.click();
    filterButton.click();
}

export function setLocationFilters(circles, appliedFilters, document, filteredTab, filterLogo, filterButton) {
    circles.forEach((circle) => {
        circle.addEventListener("click", () => {
            let sibling = getSibling(1, circle);
            if (!appliedFilters["Location"].includes(sibling.textContent)) {
                createNewFilter(sibling.textContent, "Location", appliedFilters, document);
                applyAndShowFilters(filteredTab, filterLogo, filterButton);
            }
        });
    });
}

export function closeFilterPanel(document) {
    getElement(".filters", document).style.display = "none";
}

export function toggleFilterPanel(document) {
    getElement(".filters", document).style.display = "none" ? "block" : "none";
}

export function showCardsOnScroll(document, window) {
    const mansionSection = getElement(".mansion", document);
    const sectionPosition = mansionSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.5;

    if (sectionPosition < screenPosition) {
        mansionSection.classList.add("visible");
    }
}