import * as allFunctions from "./ls-real-estate-functions.js";
import * as propertyCardFunctions from "../JS Files/property-card-functions.js";
import { checkScreenSize, getUserDetails, redirectTo, setUserDetails } from "./utility-functions.js";

// all constant declarations

const numberOfResultsElement = ".number-of-results",
	minPriceInput = ".minPriceInput",
	maxPriceInput = ".maxPriceInput",
	minAreaInput = ".minAreaInput",
	maxAreaInput = ".maxAreaInput",
	loader = document.querySelector("#loader"),
	allTab = document.querySelector("#all-tab"),
	captions = document.querySelector(".caption-p"),
	userName = document.querySelector("#user-name"),
	container = document.querySelector(".container3"),
	signOutButton = document.querySelector(".sign-out"),
	filterLogo = document.querySelector(".filter-logo"),
	crossButton = document.querySelector(".btn-close1"),
	mansionsTab = document.querySelector("#mansion-tab"),
	searchInput = document.querySelector(".search-input"),
	searchedTab = document.querySelector("#searched-tab"),
	filteredTab = document.querySelector("#filtered-tab"),
	searchButton = document.querySelector(".search-button"),
	carousel = document.querySelector(".carousel-item img"),
	filterButton = document.querySelector("#filter-button"),
	penthousesTab = document.querySelector("#penthouse-tab"),
	apartmentsTab = document.querySelector("#apartment-tab"),
	showFiltersButton = document.querySelector(".filter-logo"),
	circles = document.querySelectorAll(".circle"),
	filters = document.querySelectorAll(".dropdown-item"),
	appliedFilters = {
		Builder: [],
		Configuration: [],
		"Deal Type": [],
		Location: []
	},
	tabs = [allTab, mansionsTab, penthousesTab, apartmentsTab, filteredTab, searchedTab],
	tabStrings = ["All", "Mansions", "Penthouses", "Apartments", "Filtered", "Searched"],
	tabContents = {
		id: { All: [], Filtered: [], Searched: [], Other: [] },
		propertyTypes: { All: [], Filtered: [], Searched: [], Other: [] },
		propertyNames: { All: [], Filtered: [], Searched: [], Other: [] },
		locations: { All: [], Filtered: [], Searched: [], Other: [] },
		configurations: { All: [], Filtered: [], Searched: [], Other: [] },
		areas: { All: [], Filtered: [], Searched: [], Other: [] },
		builderNames: { All: [], Filtered: [], Searched: [], Other: [] },
		builderContactNumber: { All: [], Filtered: [], Searched: [], Other: [] },
		prices: { All: [], Filtered: [], Searched: [], Other: [] },
		states: { All: [], Filtered: [], Searched: [], Other: [] },
		images: { All: [], Filtered: [], Searched: [], Other: [] },
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
await allFunctions.setExtremeValues(minPriceInput, maxPriceInput, minAreaInput, maxAreaInput, document);
await allFunctions.createOptions(loader, document, appliedFilters);
likedPropertiesList = await propertyCardFunctions.getLikedProperties(userDetails.userName);
allFunctions.setLocationFilters(circles, appliedFilters, document, filteredTab, filterLogo, filterButton);
allFunctions.updateFilters(filters, document, appliedFilters);
setUserDetails(userDetails, false, "#userProfilePicture", false, document);
allFunctions.clickToGoTo(".bg-image2 h1", "#mansion-tab");		// click on the mansions background image to view mansions
allFunctions.clickToGoTo(".bg-image3 h1", "#penthouse-tab");	// click on the mansions background image to view penthouses


// all the intervals

setInterval(() => { checkScreenSize(isMobileScreen, clickedTab, window) }, 1000);

const typeUserNameFunction = setInterval(() => { typeDetailsList = allFunctions.typeUserName([".bg-image1", ".bg-image2", ".bg-image3"], document, [1, 1, 1 / 3], window, userDetails.userName, userName, typeDetailsList[0], typeUserNameFunction, userDetails.userName.length, typeDetailsList[1]) }, 200);


// all the event listeners
document.addEventListener("DOMContentLoaded", () => { allFunctions.unLoad(loader) });

window.addEventListener("scroll", () => { scrollPos = allFunctions.onScreenScroll(".navbar", ".nav2", ".logo p", [".bg-image1", ".bg-image2", ".bg-image3"], [1, 1, 1], window, scrollPos, document) });

window.addEventListener("scroll", () => { allFunctions.showCardsOnScroll(document, window) });

allTab.addEventListener("click", async () => { await allFunctions.showAllCards(loader, tabContents, document, numberOfResultsElement, isMobileScreen, container, clickedTab, tabs, clickedTabString, tabStrings, likedPropertiesList) });

mansionsTab.addEventListener("click", async () => { await allFunctions.showCards("Mansion", loader, tabContents, document, numberOfResultsElement, isMobileScreen, container, clickedTab, tabs, clickedTabString, tabStrings, 1, likedPropertiesList) });

penthousesTab.addEventListener("click", async () => { await allFunctions.showCards("Penthouse", loader, tabContents, document, numberOfResultsElement, isMobileScreen, container, clickedTab, tabs, clickedTabString, tabStrings, 2, likedPropertiesList) });

filteredTab.addEventListener("click", () => { allFunctions.showFilteredCards(container, tabContents, isMobileScreen, document, numberOfResultsElement, alienVisible, clickedTab, tabs, clickedTabString, tabStrings, likedPropertiesList) });

apartmentsTab.addEventListener("click", async () => { await allFunctions.showCards("Apartment", loader, tabContents, document, numberOfResultsElement, isMobileScreen, container, clickedTab, tabs, clickedTabString, tabStrings, 3, likedPropertiesList) });

searchedTab.addEventListener("click", () => { allFunctions.showSearchedCards(loader, tabContents, document, numberOfResultsElement, isMobileScreen, container, alienVisible, clickedTab, tabs, clickedTabString, tabStrings, likedPropertiesList) });

searchButton.addEventListener("click", async () => { await allFunctions.onSearchButtonClicked(loader, searchInput.value.toLowerCase(), document, searchedTab, numberOfResultsElement, tabContents, container) });

searchInput.addEventListener("keypress", (event) => { event.key === "Enter" ? searchButton.click() : "" });

carousel.addEventListener("mouseenter", () => { allFunctions.toggleCaptionsState(captions) });

carousel.addEventListener("mouseout", () => { allFunctions.toggleCaptionsState(captions) });

crossButton.addEventListener("click", () => { allFunctions.closeFilterPanel(document) });

showFiltersButton.addEventListener("click", () => { allFunctions.toggleFilterPanel(document) })

filterButton.addEventListener("click", async () => { await allFunctions.applyFilter(loader, appliedFilters, alienVisible, document, numberOfResultsElement, clickedTabString, container, filteredTab, tabContents) });

signOutButton.addEventListener("click", (event) => {
	event.preventDefault();
	console.log("preventing!!");

	localStorage.removeItem("user details token");
	redirectTo("../HTML Files/landing-page.html");
});

document.querySelector(".visit-ls-super-cars").addEventListener("click", () => {
	window.location.href = "./ls-super-cars.html";
})



clickedTab.click();
