import * as allFunctions from "./ls-super-cars-functions.js";
import * as propertyCardFunctions from "../JS Files/car-card-functions.js";
import { checkScreenSize, getUserDetails, redirectTo, setUserDetails } from "./utility-functions.js";
import { setExtremeValues } from "./ls-super-cars-api-fetches.js";

// all constant declarations

const numberOfResultsElement = ".number-of-results",
	minPriceInput = ".minPriceInput",
	maxPriceInput = ".maxPriceInput",
	minNumberOfSeatsInput = ".minNumberOfSeatsInput",
	maxNumberOfSeatsInput = ".maxNumberOfSeatsInput",
	minRatingInput = ".minRatingInput",
	maxRatingInput = ".maxRatingInput",
	minMileageInput = ".minMileageInput",
	maxMileageInput = ".maxMileageInput",
	loader = document.querySelector("#loader"),
	allTab = document.querySelector("#all-tab"),
	captions = document.querySelector(".caption-p"),
	userName = document.querySelector("#user-name"),
	container = document.querySelector(".container3"),
	signOutButton = document.querySelector(".sign-out"),
	filterLogo = document.querySelector(".filter-logo"),
	crossButton = document.querySelector(".btn-close1"),
	searchInput = document.querySelector(".search-input"),
	searchedTab = document.querySelector("#searched-tab"),
	filteredTab = document.querySelector("#filtered-tab"),
	searchButton = document.querySelector(".search-button"),
	carousel = document.querySelector(".carousel-item img"),
	filterButton = document.querySelector("#filter-button"),
	suvTab = document.querySelector("#suv-tab"),
	luxuryTab = document.querySelector("#luxury-tab"),
	sportsTab = document.querySelector("#sports-tab"),
	circles = document.querySelectorAll(".circle"),
	filters = document.querySelectorAll(".dropdown-item"),
	appliedFilters = {
		Brand: [],
		Engine: [],
		Configuration: [],
		Color: []
	},
	tabs = [allTab, suvTab, luxuryTab, sportsTab, filteredTab, searchedTab],
	tabStrings = ["All", "SUV", "Luxury", "Sports", "Filtered", "Searched"],
	tabContents = {
		id: { All: [], Filtered: [], Searched: [], Other: [] },
		images: { All: [], Filtered: [], Searched: [], Other: [] },
		carNames: { All: [], Filtered: [], Searched: [], Other: [] },
		prices: { All: [], Filtered: [], Searched: [], Other: [] },
		brands: { All: [], Filtered: [], Searched: [], Other: [] },
		carTypes: { All: [], Filtered: [], Searched: [], Other: [] },
		engineHorsePowers: { All: [], Filtered: [], Searched: [], Other: [] },
		mileages: { All: [], Filtered: [], Searched: [], Other: [] },
		numberOfSeats: { All: [], Filtered: [], Searched: [], Other: [] },
		indices: { All: [] },
	};

// all variable declarations

let userDetails,
	clickedTab = tabs[0],
	clickedTabString = tabStrings[0],
	alienVisible = false,
	isMobileScreen = false,
	typeDetailsList = [0, false],
	scrollPos = 0,
	likedPropertiesList;



userDetails = await getUserDetails();
await setExtremeValues(minPriceInput, maxPriceInput, minNumberOfSeatsInput, maxNumberOfSeatsInput, minMileageInput, maxMileageInput, document);
await allFunctions.createOptions(loader, document, appliedFilters);
likedPropertiesList = await propertyCardFunctions.getLikedProperties(userDetails.userName);
allFunctions.setLocationFilters(circles, appliedFilters, document, filteredTab, filterLogo, filterButton);
allFunctions.updateFilters(filters, document, appliedFilters);
setUserDetails(userDetails, false, "#userProfilePicture", false, document);
allFunctions.clickToGoTo(".bg-image2 h1", "#mansion-tab");		// click on the mansions background image to view mansions
allFunctions.clickToGoTo(".bg-image3 h1", "#penthouse-tab");	// click on the mansions background image to view penthouses


// all the intervals

setInterval(() => { isMobileScreen = checkScreenSize(isMobileScreen, clickedTab, window); console.log(isMobileScreen); }, 1000);

const typeUserNameFunction = setInterval(() => { typeDetailsList = allFunctions.typeUserName([".bg-image1", ".bg-image2", ".bg-image3"], document, [1, 1, 1 / 3], window, userDetails.userName, userName, typeDetailsList[0], typeUserNameFunction, userDetails.userName.length, typeDetailsList[1]) }, 200);


// all the event listeners
document.addEventListener("DOMContentLoaded", () => { allFunctions.unLoad(loader) });

window.addEventListener("scroll", () => { scrollPos = allFunctions.onScreenScroll(".navbar", ".logo p", [".bg-image1", ".bg-image2", ".bg-image3"], [1, 1, 1], window, scrollPos, document) });

window.addEventListener("scroll", () => { allFunctions.showCardsOnScroll(document, window) });

allTab.addEventListener("click", async () => { await allFunctions.showAllCards(loader, tabContents, document, numberOfResultsElement, isMobileScreen, container, clickedTab, tabs, clickedTabString, tabStrings, likedPropertiesList) });

suvTab.addEventListener("click", async () => { await allFunctions.showCards("SUV", loader, tabContents, document, numberOfResultsElement, isMobileScreen, container, clickedTab, tabs, clickedTabString, tabStrings, 2, likedPropertiesList) });

luxuryTab.addEventListener("click", async () => { await allFunctions.showCards("Luxury", loader, tabContents, document, numberOfResultsElement, isMobileScreen, container, clickedTab, tabs, clickedTabString, tabStrings, 3, likedPropertiesList) });

sportsTab.addEventListener("click", async () => { await allFunctions.showCards("Sports", loader, tabContents, document, numberOfResultsElement, isMobileScreen, container, clickedTab, tabs, clickedTabString, tabStrings, 3, likedPropertiesList) });

filteredTab.addEventListener("click", () => { allFunctions.showFilteredCards(container, tabContents, isMobileScreen, document, numberOfResultsElement, alienVisible, clickedTab, tabs, clickedTabString, tabStrings, likedPropertiesList) });

searchedTab.addEventListener("click", () => { allFunctions.showSearchedCards(loader, tabContents, document, numberOfResultsElement, isMobileScreen, container, alienVisible, clickedTab, tabs, clickedTabString, tabStrings, likedPropertiesList) });

searchButton.addEventListener("click", async () => { await allFunctions.onSearchButtonClicked(loader, searchInput.value.toLowerCase(), document, searchedTab, numberOfResultsElement, tabContents, container) });

searchInput.addEventListener("keypress", (event) => { event.key === "Enter" ? searchButton.click() : "" });

carousel.addEventListener("mouseenter", () => { allFunctions.toggleCaptionsState(captions) });

carousel.addEventListener("mouseout", () => { allFunctions.toggleCaptionsState(captions) });

crossButton.addEventListener("click", () => { allFunctions.closeFilterPanel(document) });

filterLogo.addEventListener("click", () => { allFunctions.toggleFilterPanel(document) })

filterButton.addEventListener("click", async () => { await allFunctions.applyFilter(loader, appliedFilters, alienVisible, document, numberOfResultsElement, clickedTabString, container, filteredTab, tabContents, tabs) });

signOutButton.addEventListener("click", (event) => {
	event.preventDefault();
	localStorage.removeItem("user details token");
	redirectTo("../HTML Files/landing-page.html");
});



clickedTab.click();