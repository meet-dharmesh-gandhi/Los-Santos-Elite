import { createCarCard, addLeftArrowIcon, addRightArrowIcon } from "./card.js";

const loader = document.querySelector("#loader");

const displayUserDetails = (userDetails) => {
	const userProfilePicture = document.querySelector("#userProfilePicture");
	userProfilePicture.src = userDetails.userProfilePicture;
}

let userDetails;
const token = localStorage.getItem("user details token");
try {
	const getUserDetails = await fetch("http://localhost:3000/get-user-details", {
		headers: { "Authorization": `Bearer ${token}` },
	});
	console.log(getUserDetails);
	if (!getUserDetails.ok) {
		throw new Error("Error while getting user details");
	}
	userDetails = await getUserDetails.json();
	console.log(userDetails);
	displayUserDetails(userDetails);
} catch (error) {
	console.error(error);
}

const userName = document.getElementById("user-name");

let index = 0;
let userNameSlice;
let typeStart = false;
var firstImageHeight = document.querySelector(".bg-image1").offsetHeight;
var secondImageHeight = document.querySelector(".bg-image2").offsetHeight;
var thirdImageHeight = document.querySelector(".bg-image3").offsetHeight / 3;
var totalHeight = firstImageHeight + secondImageHeight + thirdImageHeight;

const typeUserName = () => {
	const typeUserNameInterval = setInterval(() => {
		if (window.scrollY >= totalHeight) {
			typeStart = true;
		}
		if (typeStart) {
			userNameSlice = userDetails.userName[index]
			userName.textContent += userNameSlice;
			index++;
			if (index >= userDetails.userName.length) {
				clearInterval(typeUserNameInterval);
			}
		}
	}, 200);
}

setTimeout(typeUserName, 200);

// Home Page Scroll Effect
window.addEventListener("scroll", function () {
	let navbar = document.querySelector(".navbar");
	let logo = document.querySelector(".logo p");
	var firstImageHeight = document.querySelector(".bg-image1").offsetHeight;
	var secondImageHeight = document.querySelector(".bg-image2").offsetHeight;
	var thirdImageHeight = document.querySelector(".bg-image3").offsetHeight;
	var totalHeight = firstImageHeight + secondImageHeight + thirdImageHeight;
	if (window.scrollY >= totalHeight) {
		navbar.classList.add("fixed");
		logo.classList.add("hidden");
	} else {
		navbar.classList.remove("fixed");
		logo.classList.remove("hidden");
	}
});

// All

let allTab = document.querySelector("#all-tab");

// Mansions

let mansionsTab = document.querySelector("#mansion-tab");

// Penthouses

let penthousesTab = document.querySelector("#penthouse-tab");

// Apartments

let apartmentsTab = document.querySelector("#apartment-tab");

// Filtered

let filteredTab = document.querySelector("#filtered-tab");

// Clicked Tab

let clickedTab = "All";

// Searched Results Tab

const searchedTab = document.querySelector("#searched-tab");

// Click Events

let mansions = document.querySelector(".bg-image2 h1");
mansions.addEventListener("click", () => {
	window.location.href = "#mansion-tab";
	document.querySelector("#mansion-tab").click();
});

let penthouses = document.querySelector(".bg-image3 h1");
penthouses.addEventListener("click", () => {
	window.location.href = "#penthouse-tab";
	document.querySelector("#penthouse-tab").click();
});

// all property arrays:
let propertyTypes = [],
	propertyNames = [],
	locations = [],
	configurations = [],
	areas = [],
	builderNames = [],
	builderContactNumber = [],
	prices = [],
	states = [],
	images = [],
	filteredPropertyTypes = [],
	filteredPropertyNames = [],
	filteredLocations = [],
	filteredConfigurations = [],
	filteredAreas = [],
	filteredBuilderNames = [],
	filteredBuilderContactNumber = [],
	filteredPrices = [],
	filteredStates = [],
	filteredImages = [],
	allPropertyTypes = [],
	allPropertyNames = [],
	allLocations = [],
	allConfigurations = [],
	allAreas = [],
	allBuilderNames = [],
	allBuilderContactNumber = [],
	allPrices = [],
	allStates = [],
	allImages = [],
	allIndices = [],
	searchedPropertyTypes = [],
	searchedPropertyNames = [],
	searchedLocations = [],
	searchedConfigurations = [],
	searchedAreas = [],
	searchedBuilderNames = [],
	searchedBuilderContactNumber = [],
	searchedPrices = [],
	searchedStates = [],
	searchedImages = [],
	alienVisible = false,
	isMobileScreen;

// Functions

setInterval(() => {
	const mediaQuery = window.matchMedia('(max-width: 431px)');

	let handleScreenSize = (e) => {
		if (e.matches && !isMobileScreen) {
			isMobileScreen = true;
			if (clickedTab === "All") {
				allTab.click();
			} else if (clickedTab === "Mansion") {
				mansionsTab.click();
			} else if (clickedTab === "Penthouse") {
				penthousesTab.click();
			} else if (clickedTab === "Filtered") {
				filteredTab.click();
			} else if (clickedTab === "Aparment") {
				apartmentsTab.click();
			} else if (clickedTab === "Searched") {
				searchedTab.click();
			}
		} else if (!e.matches && isMobileScreen) {
			isMobileScreen = false;
			if (clickedTab === "All") {
				allTab.click();
			} else if (clickedTab === "Mansion") {
				mansionsTab.click();
			} else if (clickedTab === "Penthouse") {
				penthousesTab.click();
			} else if (clickedTab === "Filtered") {
				filteredTab.click();
			} else if (clickedTab === "Aparment") {
				apartmentsTab.click();
			} else if (clickedTab === "Searched") {
				searchedTab.click();
			}
		}
	};

	handleScreenSize(mediaQuery);

	mediaQuery.addEventListener("change", handleScreenSize);
}, 200);

const inArray = (item, array) => {
	for (let i = 0; i < array.length; i++) {
		let element = array[i];
		if (element === item) {
			return true;
		}
	}
	return false;
};

const getAllPropertyDetails = async () => {
	try {
		const response = await fetch("http://localhost:3000/get-car-details", {
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
		console.log(data);
		return data;
	} catch (error) {
		console.error("Error fetching details: ", error);
		console.log(error.message);
	}
};

const getPropertyDetails = async (propertyType) => {
	try {
		const response = await fetch("http://localhost:3000/get-property-details", {
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
	}
};

const filterProperties = async (
	type,
	minPrice,
	maxPrice,
	minArea,
	maxArea,
	builderName,
	configuration,
	dealType,
	location
) => {
	try {
		const response = await fetch("http://localhost:3000/filter-properties", {
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
				builderName,
				configuration,
				dealType,
				location,
			}),
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
	}
};

const addNewData = async (
	newTypes,
	newNames,
	newLocations,
	newConfigurations,
	newAreas,
	newBuilderNames,
	newBuilderContactNumbers,
	newPrices,
	newStates,
	newImages,
	newData
) => {
	newTypes.splice(0, newTypes.length);
	newNames.splice(0, newNames.length);
	newLocations.splice(0, newLocations.length);
	newConfigurations.splice(0, newConfigurations.length);
	newAreas.splice(0, newAreas.length);
	newBuilderNames.splice(0, newBuilderNames.length);
	newBuilderContactNumbers.splice(0, newBuilderContactNumbers.length);
	newPrices.splice(0, newPrices.length);
	newStates.splice(0, newStates.length);
	newImages.splice(0, newImages.length);
	document.querySelector(".container3").innerHTML = "";

	// Creating Given Type Cards

	for (let i = 0; i < newData.length; i++) {
		newTypes.push(newData[i]["Type"]);
		newNames.push(newData[i]["Name"]);
		newLocations.push(newData[i]["Location"]);
		newConfigurations.push(newData[i]["Configuration"]);
		newAreas.push(newData[i]["Area"]);
		newBuilderNames.push(newData[i]["Builder Name"]);
		newBuilderContactNumbers.push(newData[i]["Builder Contact Number"]);
		newPrices.push(newData[i]["Price"]);
		newStates.push(newData[i]["State"]);
		newImages.push(newData[i]["Images"][0]);
	}

	const numberOfResults = document.querySelector(".number-of-results");

	numberOfResults.textContent = `Showing ${newData.length} result(s)`;

	if (newData.length == 0) {
		numberOfResults.style.color = "red";
	} else {
		numberOfResults.style.color = "green";
	}
};

const showCards = async (type) => {
	const data = await getPropertyDetails(type);

	// Creating Given Type Cards
	addNewData(
		propertyTypes,
		propertyNames,
		locations,
		configurations,
		areas,
		builderNames,
		builderContactNumber,
		prices,
		states,
		images,
		data
	);

	for (let i = 0; i < propertyTypes.length; i++) {
		createCarCard(
			images[i],
			propertyNames[i],
			prices[i],
			locations[i],
			propertyTypes[i],
			configurations[i],
			configurations[i],
			areas[i],
			isMobileScreen
		);
		if (i === 0) {
			addRightArrowIcon();
			addLeftArrowIcon();
		}
	}

	const numberOfResults = document.querySelector(".number-of-results");

	numberOfResults.textContent = `Showing ${propertyNames.length} result(s)`;

	if (propertyNames.length == 0) {
		numberOfResults.style.color = "red";
	} else {
		numberOfResults.style.color = "green";
	}
};

const getRandomNumber = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const showAllCards = async () => {
	console.log(allPropertyTypes.length == 0);

	if (allPropertyTypes.length == 0) {
		const data = await getAllPropertyDetails();

		const len = data.length;
		let indices = [];

		for (let i = 0; i < len; i++) {
			indices.push(i);
		}

		while (indices.length > 0) {
			let i = getRandomNumber(0, indices.length - 1);
			allIndices.push(indices[i]);
			indices.splice(i, 1);
		}

		// Creating All Cards

		addNewData(
			allPropertyTypes,
			allPropertyNames,
			allLocations,
			allConfigurations,
			allAreas,
			allBuilderNames,
			allBuilderContactNumber,
			allPrices,
			allStates,
			allImages,
			data
		);
	}

	document.querySelector(".container3").innerHTML = "";

	addLeftArrowIcon();
	addRightArrowIcon();

	for (let i = 0; i < allIndices.length; i++) {
		createCarCard(
			allImages[allIndices[i]],
			allPropertyNames[allIndices[i]],
			allPrices[allIndices[i]],
			allLocations[allIndices[i]],
			allPropertyTypes[allIndices[i]],
			allConfigurations[allIndices[i]],
			allConfigurations[allIndices[i]],
			allAreas[allIndices[i]],
			isMobileScreen
		);
	}

	const numberOfResults = document.querySelector(".number-of-results");

	numberOfResults.textContent = `Showing ${allPropertyNames.length} result(s)`;

	if (allPropertyNames.length == 0) {
		numberOfResults.style.color = "red";
	} else {
		numberOfResults.style.color = "green";
	}
};

const showFilteredCards = () => {
	document.querySelector(".container3").innerHTML = "";
	for (let i = 0; i < filteredPropertyTypes.length; i++) {
		createCarCard(
			filteredImages[i],
			filteredPropertyNames[i],
			filteredPrices[i],
			filteredLocations[i],
			filteredPropertyTypes[i],
			filteredConfigurations[i],
			filteredConfigurations[i],
			filteredAreas[i],
			isMobileScreen
		);
		if (i === 0) {
			addRightArrowIcon();
			addLeftArrowIcon();
		}
	}
	if (filteredPropertyTypes.length < 1) {
		createFilterButton();
	}

	const numberOfResults = document.querySelector(".number-of-results");

	numberOfResults.textContent = `Showing ${filteredPropertyNames.length} result(s)`;

	if (filteredPropertyNames.length == 0) {
		numberOfResults.style.color = "red";
	} else {
		numberOfResults.style.color = "green";
	}

	if (filteredPropertyNames.length == 0) {
		showAlien("Yay!! You Found Me!!");
	} else if (alienVisible && filteredPropertyNames.length != 0) {
		hideAlien();
		alienVisible = false;
	}
};

allTab.addEventListener("click", () => {
	showAllCards();
	clickedTab = "All";
});

allTab.click();

mansionsTab.addEventListener("click", async () => {
	showCards("Mansion");
	clickedTab = "Mansion";
});

penthousesTab.addEventListener("click", async () => {
	showCards("Penthouse");
	clickedTab = "Penthouse";
});

filteredTab.addEventListener("click", () => {
	showFilteredCards();
	clickedTab = "Filtered";
});

apartmentsTab.addEventListener("click", async () => {
	showCards("Apartment");
	clickedTab = "Apartment";
});

searchedTab.addEventListener("click", async () => {
	document.querySelector(".container3").innerHTML = "";

	addLeftArrowIcon();
	addRightArrowIcon();

	for (let i = 0; i < searchedPropertyNames.length; i++) {
		createCarCard(
			searchedImages[i],
			searchedPropertyNames[i],
			searchedPrices[i],
			searchedLocations[i],
			searchedPropertyTypes[i],
			searchedConfigurations[i],
			searchedConfigurations[i],
			searchedAreas[i],
			isMobileScreen
		);
	}

	const numberOfResults = document.querySelector(".number-of-results");

	numberOfResults.textContent = `Showing ${searchedPropertyNames.length} result(s)`;

	if (searchedPropertyNames.length == 0) {
		numberOfResults.style.color = "red";
	} else {
		numberOfResults.style.color = "green";
	}

	if (alienVisible && searchedPropertyNames.length != 0) {
		hideAlien();
		alienVisible = false;
	} else if (!alienVisible && searchedPropertyNames.length == 0) {
		showAlien("Yay!! You Found Me!!");
		alienVisible = true;
	}
});

const trimString = (numberString) => {
	while (numberString[numberString.length - 1] == "0") {
		numberString = numberString.slice(0, -1);
	}
	return numberString;
};

let container = document.querySelector(".container3");
container.addEventListener("scroll", function () {
	let icon2 = document.querySelector(".fa-circle-chevron-left");

	if (container.scrollLeft > 0) {
		icon2.style.display = "block";
	} else {
		icon2.style.display = "none";
	}
});

container.addEventListener("scroll", function () {
	let icon1 = document.querySelector(".fa-circle-chevron-left");

	if (container.scrollLeft > 0) {
		icon1.style.display = "block";
	} else {
		icon1.style.display = "none";
	}
});

const getSearchedProperties = async (Name) => {
	try {
		const response = await fetch("http://localhost:3000/get-specifics", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ Name }),
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
	}
}

// Search Bar

let searchInput = document.querySelector(".search-input");
let searchButton = document.querySelector(".search-button");

searchButton.addEventListener("click", async () => {
	let searchInputValue = searchInput.value;
	let input = searchInputValue.toLowerCase();
	const checkElement = document.getElementById(`${input}-tab`);
	const checkElementMinusS = document.getElementById(`${input.slice(0, -1)}-tab`);
	console.log(input.slice(0, -1));
	if (checkElement != null || checkElementMinusS != null) {
		if (input[input.length - 1] === "s") {
			let newInput = input.slice(0, -1);
			window.location.href = `#${newInput}-tab`;
			document.querySelector(`#${newInput}-tab`).click();
		} else {
			window.location.href = `#${input}-tab`;
			document.querySelector(`#${input}-tab`).click();
		}
	} else {
		const lowercasePropertyNames = [];
		allPropertyNames.forEach((element) => {
			lowercasePropertyNames.push(element.toLowerCase());
		});
		if (inArray(input, lowercasePropertyNames)) {
			const index = lowercasePropertyNames.indexOf(input);
			const data = await getSearchedProperties(allPropertyNames[index]);
			console.log(data);
			addNewData(
				searchedPropertyTypes,
				searchedPropertyNames,
				searchedLocations,
				searchedConfigurations,
				searchedAreas,
				searchedBuilderNames,
				searchedBuilderContactNumber,
				searchedPrices,
				searchedStates,
				searchedImages,
				data
			);
		}
		searchedTab.click();
	}
});

searchInput.addEventListener("keypress", (event) => {
	if (event.key == "Enter") {
		searchButton.click();
	}
});

window.addEventListener("scroll", () => {
	const mansionSection = document.getElementById("cars");
	const sectionPosition = mansionSection.getBoundingClientRect().top;
	const screenPosition = window.innerHeight / 1.5;

	if (sectionPosition < screenPosition) {
		mansionSection.classList.add("visible");
	}
});

let carousel = document.querySelector(".carousel-item img");
carousel.addEventListener("mouseenter", () => {
	let captions = document.querySelector(".caption-p");
	captions.classList.toggle("caption-p-display");
});
carousel.addEventListener("mouseout", () => {
	let captions = document.querySelector(".caption-p");
	captions.classList.toggle("caption-p-display");
});

// Close button for filter section

let crossButton = document.querySelector(".btn-close1");
crossButton.addEventListener("click", () => {
	let filterSection = document.querySelector(".filters");
	filterSection.style.display = "none";
});

const addOptions = (elementArray, parentElement, config) => {
	elementArray.forEach((element) => {
		let option = document.createElement("p");
		option.className = "dropdown-item";
		if (config) {
			option.textContent = element + " BHK";
		} else {
			option.textContent = element;
		}
		parentElement.appendChild(option);
	});
};

const getAttribute = async (attribute) => {
	try {
		const result = await fetch("http://localhost:3000/get-unique-values", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ value: attribute }),
		});
		const data = await result.json();
		return data;
	} catch (error) {
		console.log(error);
	}
};

const createOptions = async () => {
	let BuilderNames = await getAttribute("Builder Name"),
		Configurations = await getAttribute("Configuration"),
		States = await getAttribute("State"),
		Locations = await getAttribute("Location");

	const builder = document.querySelector(".builder"),
		configuration = document.querySelector(".configuration"),
		dealType = document.querySelector(".dealType"),
		location = document.querySelector(".location");

	addOptions(BuilderNames, builder, false);
	addOptions(Configurations, configuration, true);
	addOptions(States, dealType, false);
	addOptions(Locations, location, false);
};

await createOptions();

const filters = document.querySelectorAll(".dropdown-item");

const filterButton = document.getElementById("filter-button");

const appliedFilters = {
	Builder: [],
	Configuration: [],
	"Deal Type": [],
	Location: [],
};

let circles = document.querySelectorAll(".circle");
let selectedItem = document.querySelectorAll(".selected");
circles.forEach((circle) => {
	circle.addEventListener("click", () => {
		let circleId = circle.getAttribute("id");
		let content = document.querySelectorAll(`#${circleId}`);
		let element = content[1];
		if (!inArray(element.textContent, appliedFilters["Location"])) {
			const selectedFilters = document.querySelector(".selectedFilters");
			const newFilter = document.createElement("div");
			newFilter.className = "selected";
			newFilter.textContent = content[1].textContent;
			const closeButton = document.createElement("button");
			closeButton.className = "btn-close btn-close2";
			closeButton.type = "button";
			newFilter.appendChild(closeButton);
			selectedFilters.appendChild(newFilter);
			appliedFilters["Location"].push(element.textContent);
			closeButton.addEventListener("click", () => {
				newFilter.remove();
				appliedFilters["Location"].splice(
					appliedFilters["Location"].indexOf(element.textContent),
					1
				);
			});
			console.log(appliedFilters["Location"]);
			let filterLogo = document.querySelector(".filterLogo");
			filteredTab.click();
			filterLogo.click();
			filterButton.click();
		}
	});
});

filters.forEach((element) => {
	element.addEventListener("click", () => {
		if (
			!inArray(
				element.textContent,
				appliedFilters[
				element.parentNode.parentNode.textContent.trim().split("\n")[0]
				]
			)
		) {
			const selectedFilters = document.querySelector(".selectedFilters");
			const newFilter = document.createElement("div");
			newFilter.className = "selected";
			newFilter.textContent = element.textContent;
			const closeButton = document.createElement("button");
			closeButton.className = "btn-close btn-close2";
			closeButton.type = "button";
			newFilter.appendChild(closeButton);
			selectedFilters.appendChild(newFilter);
			console.log(
				element.parentNode.parentNode.textContent.trim().split("\n")[0]
			);
			appliedFilters[
				element.parentNode.parentNode.textContent.trim().split("\n")[0]
			].push(element.textContent);
			closeButton.addEventListener("click", () => {
				newFilter.remove();
				appliedFilters[
					element.parentNode.parentNode.textContent.trim().split("\n")[0]
				].splice(
					appliedFilters[
						element.parentNode.parentNode.textContent.trim().split("\n")[0]
					].indexOf(element.textContent),
					1
				);
			});
		}
	});
});

function extractNumbers(numberString, check) {
	let stringNumber = "";
	if (check) {
		for (let i = 0; i < numberString.length; i++) {
			if (
				numberString[i].charCodeAt(0) >= 48 &&
				numberString[i].charCodeAt(0) <= 57
			) {
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

function extractNumbersFromArray(array) {
	let arrayOfNumbers = [];
	array.forEach((element) => {
		arrayOfNumbers.push(extractNumbers(element, false));
	});
	return arrayOfNumbers;
}

function showAlien(messageText) {
	const container = document.querySelector(".container3");
	const alienContainer = document.createElement("div");
	alienContainer.className = "alien-container";
	const alien = document.createElement("div");
	alien.className = "alien";
	const alienImg = document.createElement("img");
	alienImg.src = "./images/astronaut.png";
	alienImg.alt = "Alien in spaceship";
	alienImg.className = "alien-img";
	const message = document.createElement("p");
	message.className = "alien-message";
	message.innerHTML = messageText;
	alien.appendChild(alienImg);
	alien.appendChild(message);
	alienContainer.appendChild(alien);
	container.appendChild(alienContainer);
}

function hideAlien() {
	const alien = document.querySelector(".alien");
	alien.classList.add("alien-go");
	alien.addEventListener("animationend", () => {
		alien.removeEventListener("animationend", this);
		filterButton.click();
	});
}

filterButton.addEventListener("click", async () => {
	console.log(clickedTab);
	const minPrice = extractNumbers(
		document.querySelector(".minPriceInput").textContent,
		true
	),
		maxPrice = extractNumbers(
			document.querySelector(".maxPriceInput").textContent,
			true
		),
		minArea = extractNumbers(
			document.querySelector(".minAreaInput").textContent,
			true
		),
		maxArea = extractNumbers(
			document.querySelector(".maxAreaInput").textContent,
			true
		),
		builderName = appliedFilters["Builder"],
		configuration = extractNumbersFromArray(appliedFilters["Configuration"]),
		dealType = appliedFilters["Deal Type"],
		location = appliedFilters["Location"];

	if (minPrice >= maxPrice) {
		if (alienVisible) {
			hideAlien();
			alienVisible = false;
		}
		document.querySelector(".container3").innerHTML = "";
		showAlien(
			"Check your Math Buddy!!<br>Minimum Price cannot be greater than Maximum Price!!"
		);

		const numberOfResults = document.querySelector(".number-of-results");

		numberOfResults.textContent = "Showing 0 result(s)";

		numberOfResults.style.color = "red";

		alienVisible = true;

		return;
	} else if (minArea >= maxArea) {
		if (alienVisible) {
			hideAlien();
			alienVisible = false;
		}
		document.querySelector(".container3").innerHTML = "";
		showAlien(
			"Check your Math Buddy!!<br>Minimum Area cannot be greater than Maximum Area!!"
		);

		const numberOfResults = document.querySelector(".number-of-results");

		numberOfResults.textContent = "Showing 0 result(s)";

		numberOfResults.style.color = "red";

		alienVisible = true;

		return;
	}

	let data;

	if (clickedTab == "All" || clickedTab == "Filtered") {
		data = await filterProperties(
			"All",
			minPrice,
			maxPrice,
			minArea,
			maxArea,
			builderName,
			configuration,
			dealType,
			location
		);
	} else {
		data = await filterProperties(
			clickedTab,
			minPrice,
			maxPrice,
			minArea,
			maxArea,
			builderName,
			configuration,
			dealType,
			location
		);
	}

	console.log(data);

	console.log(data.length == 0);

	if (alienVisible && data.length != 0) {
		hideAlien();
		alienVisible = false;
	}

	if (data.length == 0) {
		addNewData(
			filteredPropertyTypes,
			filteredPropertyNames,
			filteredLocations,
			filteredConfigurations,
			filteredAreas,
			filteredBuilderNames,
			filteredBuilderContactNumber,
			filteredPrices,
			filteredStates,
			filteredImages,
			data
		);
		showAlien("Yay!! You Found Me!!");
		alienVisible = true;
	} else {
		addNewData(
			filteredPropertyTypes,
			filteredPropertyNames,
			filteredLocations,
			filteredConfigurations,
			filteredAreas,
			filteredBuilderNames,
			filteredBuilderContactNumber,
			filteredPrices,
			filteredStates,
			filteredImages,
			data
		);
		if (clickedTab == "All" || clickedTab == "Filtered") {
			filteredTab.click();
		} else {
			showFilteredCards();
		}
	}
});

let signOut = document.querySelector(".sign-out");
signOut.addEventListener("click", (e) => {
	e.preventDefault();
	window.location.href = "http://127.0.0.1:5500/landingpage.html";
});

let cart = document.querySelector(".cart");
cart.addEventListener("click", () => {
	window.location.href = "http://127.0.0.1:5500/show%20cart.html?username=Kushal%20Rathod";
});

let username = document.querySelector("#user-name");
username.innerText = localStorage.getItem('name');
console.log(username);