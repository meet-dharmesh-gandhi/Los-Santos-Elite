// pending tasks:
// 1. show liked properties with a fa-solid heart
// 2. stop anyone from accessing any of the web pages from in-between, redirect to sign in page if status is 403
// 3. link the profile page
// 4. add and remove liked properties according to id not name

import { addLeftArrowIcon, addRightArrowIcon } from "./property-card-functions.js";
import { createElement, getElement, getRandomNumber, getSibling, load, redirectTo, unLoad } from "./utility-functions.js";
import { getAllPropertyDetails, getAttributes, getPropertyDetails, getSearchedProperties, filterCars, addToWishlist, removeFromWishlist } from "../JS Files/ls-super-cars-api-fetches.js";
import { createCarCard } from "./car-card-functions.js";

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

export function onScreenScroll(navbar, logo, heights, multipliers, window, scrollPos, document) {
    var totalHeight = getTotalHeight(heights, multipliers, document);

    if (window.scrollY >= totalHeight) {
        document.querySelector(logo).classList.add("hidden");
    } else {
        document.querySelector(logo).classList.remove("hidden");
    }
    if (window.pageYOffset >= totalHeight && (document.body.getBoundingClientRect()).top > scrollPos) {
        document.querySelector(navbar).classList.add("fixed");

    } else {
        document.querySelector(navbar).classList.remove("fixed");
    }
    scrollPos = (document.body.getBoundingClientRect()).top;
    return scrollPos;
}

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
    const paramsList = ["id", "images", "carNames", "prices", "brands", "carTypes", "engineHorsePowers", "mileages", "numberOfSeats"];
    const dataParamsOrder = ["_id", "Images", "Name", "Price", "Brand", "Type", "Engine.Horsepower", "Mileage", "Number Of Seats"]

    container.innerHTML = "";

    for (let i = 0; i < paramsList.length; i++) {
        tabContents[paramsList[i]][tab].splice(0);
    }

    for (let i = 0; i < newData.length; i++) {
        for (let j = 0; j < paramsList.length; j++) {
            if (j === 6) {
                tabContents[paramsList[j]][tab].push(newData[i]["Engine"]["Horsepower"]);
            } else {
                tabContents[paramsList[j]][tab].push(newData[i][dataParamsOrder[j]]);
            }
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
    console.log(tabContents);

    if (tabContents.carTypes.All.length == 0) {
        console.log("Here i am!!");

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
        console.log(tabContents);

        tabContents = addNewData(data, document, numberOfResultsElement, container, tabContents, "All");

        console.log(tabContents);

    }

    container.innerHTML = "";
    console.log(tabContents.brands.All[tabContents.indices.All[1]]);


    for (let i = 0; i < tabContents.indices.All.length; i++) {
        createCarCard(
            tabContents.id.All[tabContents.indices.All[i]],
            tabContents.images.All[tabContents.indices.All[i]],
            tabContents.carNames.All[tabContents.indices.All[i]],
            tabContents.prices.All[tabContents.indices.All[i]],
            tabContents.brands.All[tabContents.indices.All[i]],
            tabContents.carTypes.All[tabContents.indices.All[i]],
            tabContents.engineHorsePowers.All[tabContents.indices.All[i]],
            tabContents.mileages.All[tabContents.indices.All[i]],
            tabContents.numberOfSeats.All[tabContents.indices.All[i]],
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

    showResults(document, numberOfResultsElement, tabContents.carNames.All.length);

    loader.style.display = "none";

    clickedTab = tabs[0];
    clickedTabString = tabStrings[0];
}

export async function showCards(type, loader, tabContents, document, numberOfResultsElement, isMobileScreen, container, clickedTab, tabs, clickedTabString, tabStrings, index, likedPropertiesList) {
    load(loader);

    const data = await getPropertyDetails(type, loader);
    console.log(tabs);


    tabContents = addNewData(data, document, numberOfResultsElement, container, tabContents, "Other");

    container.innerHTML = "";


    for (let i = 0; i < tabContents.carNames.Other.length; i++) {
        createCarCard(
            tabContents.id.Other[i],
            tabContents.images.Other[i],
            tabContents.carNames.Other[i],
            tabContents.prices.Other[i],
            tabContents.brands.Other[i],
            tabContents.carTypes.Other[i],
            tabContents.engineHorsePowers.Other[i],
            tabContents.mileages.Other[i],
            tabContents.numberOfSeats.Other[i],
            isMobileScreen,
            document,
            container,
            likedPropertiesList
        );

    }
    if (tabContents.carNames.Other.length > 0) {
        addRightArrowIcon();
        addLeftArrowIcon();
    }

    showResults(document, numberOfResultsElement, tabContents.carNames.Other.length)

    unLoad(loader);

    clickedTab = tabs[index];
    clickedTabString = tabStrings[index];
};

export function showSearchedCards(loader, tabContents, document, numberOfResultsElement, isMobileScreen, container, alienVisible, clickedTab, tabs, clickedTabString, tabStrings, likedPropertiesList) {
    load(loader);

    container.innerHTML = "";

    for (let i = 0; i < tabContents.carTypes.Searched.length; i++) {
        createCarCard(
            tabContents.id.Searched[i],
            tabContents.images.Searched[i],
            tabContents.carNames.Searched[i],
            tabContents.prices.Searched[i],
            tabContents.brands.Searched[i],
            tabContents.carTypes.Searched[i],
            tabContents.engineHorsePowers.Searched[i],
            tabContents.mileages.Searched[i],
            tabContents.numberOfSeats.Searched[i],
            isMobileScreen,
            document,
            container,
            likedPropertiesList
        );
    }

    if (tabContents.carTypes.Searched.length > 0) {
        addLeftArrowIcon();
        addRightArrowIcon();
    }

    showResults(document, numberOfResultsElement, tabContents.carTypes.Searched.length);

    alienVisible = toggleAlienState(alienVisible, tabContents.carNames.Searched.length, container, document);

    redirectTo("#searched-tab");

    unLoad(loader);

    clickedTab = tabs[5];
    clickedTabString = tabStrings[5];
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
                Type: tabContents.carTypes.Searched,
                Name: tabContents.carNames.Searched,
                Location: tabContents.numberOfSeats.Searched,
                Configuration: tabContents.engineHorsePowers.Searched,
                Area: tabContents.mileages.Searched,
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
        const colors = [];
        for (let j = 0; j < elementArray.length; j++) {
            if (i === 3) {
                colors.push(elementArray[j]);
                if (j === elementArray.length - 1) {
                    const elements = Array.from(new Set(colors.flat()));
                    elements.forEach(element => {
                        const option = createElement("p", parentElement, { className: "dropdown-item", textContent: element }, document);
                        option.addEventListener("click", () => {
                            createNewFilter(option.textContent, category, appliedFilters, document)
                        });
                    });
                }
            } else {
                const element = elementArray[j];
                const option = createElement("p", parentElement, { className: "dropdown-item", textContent: element }, document);
                option.addEventListener("click", () => {
                    createNewFilter(option.textContent, category, appliedFilters, document)
                })
            }
        }
    }
};

export async function createOptions(loader, document, appliedFilters) {
    load(loader);

    const [Brands, Configurations, Engines, Colors] = await getAttributes(["Brand", "Configuration", "Engine.Other Factors", "Color"]);

    const brands = getElement(".brand", document),
        configuration = getElement(".configuration", document),
        engine = getElement(".engine", document),
        color = getElement(".color", document);

    addOptions([Brands, Configurations, Engines, Colors], [brands, configuration, engine, color], [false, true, false, false], document, appliedFilters);

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

export async function applyFilter(loader, appliedFilters, alienVisible, document, numberOfResultsElement, clickedTabString, container, filteredTab, tabContents, tabs) {
    load(loader);

    const minPrice = extractNumbers(document.querySelector(".minPriceInput").textContent, true),
        maxPrice = extractNumbers(document.querySelector(".maxPriceInput").textContent, true),
        minNumberOfSeats = extractNumbers(document.querySelector(".minNumberOfSeatsInput").textContent, true),
        maxNumberOfSeats = extractNumbers(document.querySelector(".maxNumberOfSeatsInput").textContent, true),
        minRating = extractNumbers(document.querySelector(".minRatingInput").textContent, true),
        maxRating = extractNumbers(document.querySelector(".maxRatingInput").textContent, true),
        minMileage = extractNumbers(document.querySelector(".minMileageInput").textContent, true),
        maxMileage = extractNumbers(document.querySelector(".maxMileageInput").textContent, true),
        brand = appliedFilters["Brand"],
        engineType = appliedFilters["Engine"],
        configuration = appliedFilters["Configuration"],
        color = appliedFilters["Color"];


    document.querySelector(".container3").innerHTML = "";
    if (minPrice >= maxPrice || minNumberOfSeats >= maxNumberOfSeats || minRating > maxRating || minMileage > maxMileage) {
        if (alienVisible) {
            alienVisible = false;
        }
        const parameter = minPrice >= maxPrice ? "Price" : minNumberOfSeats >= maxNumberOfSeats ? "Area" : minRating > maxRating ? "Rating" : minMileage > maxMileage ? "Mileage" : "";

        showAlien(`Check your Math Buddy!!<br>Minimum ${parameter} cannot be greater than Maximum ${parameter}!!`, container, document);

        showResults(document, numberOfResultsElement, 0);

        const numberOfResults = document.querySelector(".number-of-results");

        numberOfResults.textContent = "Showing 0 result(s)";

        numberOfResults.style.color = "red";

        alienVisible = true;

        return;
    }

    let data = await filterCars(
        clickedTabString === "All" || clickedTabString === "Filtered" ? "All" : clickedTabString,
        minPrice,
        maxPrice,
        minNumberOfSeats,
        maxNumberOfSeats,
        minMileage,
        maxMileage,
        minRating,
        maxRating,
        brand,
        configuration,
        engineType,
        color
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

    for (let i = 0; i < tabContents.carTypes.Filtered.length; i++) {
        createCarCard(
            tabContents.id.Filtered[i],
            tabContents.images.Filtered[i],
            tabContents.carNames.Filtered[i],
            tabContents.prices.Filtered[i],
            tabContents.brands.Filtered[i],
            tabContents.carTypes.Filtered[i],
            tabContents.engineHorsePowers.Filtered[i],
            tabContents.mileages.Filtered[i],
            tabContents.numberOfSeats.Filtered[i],
            isMobileScreen,
            document,
            container,
            likedPropertiesList
        );
    }

    if (tabContents.carTypes.Filtered.length > 0) {
        addRightArrowIcon();
        addLeftArrowIcon();
    }

    showResults(document, numberOfResultsElement, tabContents.carTypes.Filtered.length);

    toggleAlienState(alienVisible, tabContents.carTypes.Filtered.length, container, document);

    clickedTab = tabs[4];
    clickedTabString = tabStrings[4];
};

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
    const mansionSection = getElement(".cars", document);
    const sectionPosition = mansionSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.5;

    if (sectionPosition < screenPosition) {
        mansionSection.classList.add("visible");
    }
}