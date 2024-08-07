import { getUserDetails } from "./utility-functions.js";

const loader = document.querySelector("#loader");
let userDetails;
let username;
const serverURL = "https://los-santos-elite-2gyo.onrender.com";

const setUserDetails = (userDetails) => {
	if (userDetails.userName) {
		document.querySelectorAll(".userName").forEach(element => { element.textContent = userDetails.userName })
		document.querySelector(".userName-input").textContent = userDetails.userName;
	}
	if (userDetails.userEmail) {
		document.querySelector(".userEmail").textContent = userDetails.userEmail;
	}
	if (userDetails.userPhone) {
		document.querySelector(".userPhoneNumber").textContent = userDetails.userPhone;
	}
	if (userDetails.Name) {
		document.querySelector(".name-input").textContent = userDetails.Name
	}
	document.querySelector("#userProfilePicture").src = userDetails.userProfilePicture;
}

await getUserDetails();

let inputBoxes = document.querySelectorAll(".inputBox");
console.log(inputBoxes);
inputBoxes.forEach((inputBox) => {
	inputBox.addEventListener("click", () => {
		inputBox.classList.add("add");
	});
	window.addEventListener("click", (e) => {
		if (e.target != inputBox) {
			inputBox.classList.remove("add");
		}
	})
})

let eye = document.querySelector(".eye");
let state = "off";
eye.addEventListener("click", () => {
	if (state == "off") {
		let input = document.querySelector(".passwordInput input");
		input.setAttribute("type", "text");
		eye.className = "fa-regular fa-eye eye"
		state = "on";
	}
	else if (state == "on") {
		let input = document.querySelector(".passwordInput input");
		input.setAttribute("type", "password");
		eye.className = "fa-regular fa-eye-slash eye";
		state = "off";
	}
});

let box1 = document.querySelector(".box-1");
let price = document.querySelector(".price");
box1.addEventListener("mouseover", () => {
	price.style.color = "white";
});
box1.addEventListener("mouseout", () => {
	price.style.color = "navy";
});

let counter = document.querySelector(".price");
let speed = 300;

let animate = () => {
	let value = +counter.getAttribute("number");
	let data = +counter.innerText;
	let time = value / speed;

	if (data < value) {
		counter.innerText = Math.ceil(data + time);
		setTimeout(animate, 1);
	} else {
		let newValue = value / 1000000;
		counter.innerText = "$" + newValue + "M";
	}
}

animate();

let amount = parseInt(price.getAttribute("number"));
let withdraw = document.querySelector(".withdraw");
withdraw.addEventListener("click", () => {
	let withdrawAmount = prompt("Enter the amount you want to withdraw");
	console.log(withdrawAmount);
	while (withdrawAmount === "" || parseInt(withdrawAmount) <= 0 || withdrawAmount == NaN || parseInt(withdrawAmount) > amount) {
		if (parseInt(withdrawAmount) > amount) {
			alert("Insufficient funds");
		}
		withdrawAmount = prompt("Enter the amount you want to withdraw");
	}
	let result = 0;
	if (withdrawAmount != null) {
		result = window.confirm(`You want to withdraw $${withdrawAmount}`);
	}
	let updatedPrice = amount - parseInt(withdrawAmount);
	console.log(updatedPrice);
	if (result) {
		if (updatedPrice >= 1000000) {
			counter.innerText = "$" + updatedPrice / 1000000 + "M";
		}
		else {
			counter.innerText = "$" + updatedPrice;
		}
	}
	price.setAttribute("number", `${updatedPrice}`);
	amount = updatedPrice;
});

const getTransactionHistory = async () => {
	try {
		const response = await fetch(
			serverURL + "/get-transaction-history",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username }),
			}
		);
		console.log(username);
		let data = await response.json();
		console.log(data);
		data = data["Transaction History"];
		return data;
	} catch (error) {
		console.log(error);
	}
};

const getLikedCards = async (username) => {
	const response = await fetch(serverURL + "/get-liked-properties", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username }),
	});
	const data = await response.json();
	data.forEach((element) => {
		createCard(element["Images"][0], element["Name"], element["Price"], element["Location"], element["Type"], element["Configuration"], element["Configuration"], element["Area"], ".liked-properties");
	});
}

const getUserListings = async () => {
	try {
		const response = await fetch(serverURL + "/get-user-listings", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ username }),
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
	}
}

const checkSeller = async () => {
	const seller = await fetch(serverURL + "/check-if-seller", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username }),
	});
	const isSeller = await seller.json();
	return isSeller;
}

const extractParameter = (array, parameter) => {
	let finalList = [];
	array.forEach(element => {
		finalList.push(element[parameter]);
	});
	return finalList;
}

function createTableFromData(data) {

	const container = document.querySelector(".table");
	container.innerHTML = `<table id="data-table" border="1">
						<thead>
						<tr>
							<th>Sr No.</th>
							<th>Type</th>
							<th>Name</th>
							<th>Price</th>
							<th>Quantity</th>
							<th>Date</th>
						</tr>
						</thead>
						<tbody></tbody>
					</table>`;

	const tableBody = document.querySelector("#data-table tbody");

	let cnt = 1;

	data.forEach((item) => {
		const srNo = cnt;
		const length = item[0].length;
		const details = item[0];
		const prices = extractParameter(details, "Price");
		const types = extractParameter(details, "Name");
		const names = extractParameter(details, "Type");
		const quantities = item[1];
		const date = item[2];
		for (let i = 0; i < length; i++) {
			const row = document.createElement("tr");

			const srNoCell = document.createElement("td");
			srNoCell.textContent = cnt.toString();

			const typeCell = document.createElement("td");
			typeCell.textContent = types[i];

			const nameCell = document.createElement("td");
			nameCell.textContent = names[i];

			const priceCell = document.createElement("td");
			priceCell.textContent = "$" + prices[i];

			const quantityCell = document.createElement("td");
			quantityCell.textContent = quantities[i];

			const dateCell = document.createElement("td");
			dateCell.textContent = date;

			row.appendChild(srNoCell);
			row.appendChild(typeCell);
			row.appendChild(nameCell);
			row.appendChild(priceCell);
			row.appendChild(quantityCell);
			row.appendChild(dateCell);
			tableBody.appendChild(row);
			cnt++;
		}
	});
}

const createCardsFromData = (data) => {
	console.log(data);
	data.forEach(element => {
		const length = element[0].length;
		const details = element[0];
		const imgSrc = extractParameter(details, "Images");
		const propertyName = extractParameter(details, "Name");
		const price = extractParameter(details, "Price");
		const location = extractParameter(details, "Location");
		const type = extractParameter(details, "Type");
		const configuration = extractParameter(details, "Configuration");
		const area = extractParameter(details, "Area");
		for (let i = 0; i < length; i++) {
			createCard(imgSrc[i][0], propertyName[i], price[i], location[i], type[i], configuration[i], configuration[i], area[i], ".yourBuyings");
		}
	})
}

function createItemCard(
	propertyName,
	configuration,
	propertyType,
	state,
	price
) {
	let box = document.querySelector(".display-card");
	box.innerHTML += `
        <div class="cards">
			<div class="image">
				<img src="../Other Media/images/mansion.jpg" alt="">
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
						<button class="remove-button ${propertyName.replaceAll(" ", "-")}">Remove from Cart</button>
					<h4 class="cardPrice">${price}</h4>
				</div>
			</div>
        </div>
        `;
}

const createCardFromListingsData = (listingsData) => {
	listingsData.forEach((element) => {

		const name = element.Name;
		const configuration = element.Configuration;
		const type = element.Type;
		const state = element.State;
		const price = element.Price;

		createItemCard(name, configuration, type, state, price);
	});
}

const trimString = (numberString) => {
	while (numberString[numberString.length - 1] == "0") {
		numberString = numberString.slice(0, -1);
	}
	return numberString;
};

const numberToString = (number) => {
	let numberString = "";
	number = number.toString();
	if (number.slice(number.length - 6, number.length) === "000000") {
		numberString = number.slice(0, number.length - 6) + " M";
	} else if (number.length > 6) {
		numberString =
			trimString(number.slice(0, number.length - 6)) +
			"." +
			trimString(number.slice(number.length - 6, number.length - 1)) +
			" M";
	} else if (number.slice(number.length - 3, number.length) === "000") {
		numberString = number.slice(0, number.length - 3) + " K";
	} else {
		numberString = number;
	}
	return numberString;
};

const addToWishlist = async (propertyName, userName) => {
	try {
		const userName = document.getElementById("userName");
		const response = await fetch(serverURL + "/add-to-wishlist", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ userName, propertyName }),
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
	}
};

const removeFromWishlist = async (propertyName, userName) => {
	try {
		const userName = document.getElementById("userName");
		const response = await fetch(serverURL + "/remove-from-wishlist", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ userName, propertyName }),
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
	}
};

function createCard(
	imgSrc,
	propertyName,
	price,
	Locations,
	propertyType,
	bedroom,
	bathroom,
	area,
	container
) {

	const card = document.createElement("div");
	card.className = "card col-lg-3";
	card.style.width = "18rem";
	card.id = "card1";

	const img = document.createElement("img");
	img.src = imgSrc;
	img.alt = propertyName;
	img.className = "card-img-top";
	card.appendChild(img);

	const likeButton = document.createElement("div");
	likeButton.className = "like-button";
	const likeButtonText = document.createElement("i");
	likeButtonText.className = "fa-solid fa-heart liked";
	likeButton.appendChild(likeButtonText);
	likeButton.addEventListener("click", () => {
		if (likeButtonText.classList.contains("fa-regular")) {
			likeButtonText.classList.remove("fa-regular");
			likeButtonText.classList.add("fa-solid");
			addToWishlist(propertyName);
			document.querySelector("#liveToastBtn").click();
		} else {
			likeButtonText.classList.remove("fa-solid");
			likeButtonText.classList.add("fa-regular");
			removeFromWishlist(propertyName);
			document.querySelector("#liveToastBtn").click();
		}
		likeButtonText.classList.toggle("liked");
	});
	card.appendChild(likeButton);

	const cardBody = document.createElement("div");
	cardBody.className = "card-body";

	const cardTitle = document.createElement("h5");
	cardTitle.className = "card-title";
	cardTitle.textContent = propertyName;
	cardBody.appendChild(cardTitle);

	const cardText = document.createElement("p");
	cardText.className = "card-price";
	cardText.textContent = numberToString(price);
	cardBody.appendChild(cardText);

	const location = document.createElement("p");
	location.className = "location";
	location.textContent = Locations;
	cardBody.appendChild(location);

	const type = document.createElement("p");
	type.className = "property-type";
	type.textContent = propertyType;
	cardBody.appendChild(type);

	const hr1 = document.createElement("hr");
	cardBody.appendChild(hr1);

	const details = document.createElement("div");
	details.className = "details1";

	const bedIcon = document.createElement("i");
	bedIcon.className = "fa-solid fa-bed";
	details.appendChild(bedIcon);

	const bedrooms = document.createElement("p");
	bedrooms.className = "bedrooms";
	bedrooms.innerHTML = `<span class="num1">${bedroom}</span> Bedrooms`;
	details.appendChild(bedrooms);

	const bathIcon = document.createElement("i");
	bathIcon.className = "fa-solid fa-bath";
	details.appendChild(bathIcon);

	const bathrooms = document.createElement("p");
	bathrooms.className = "bathrooms";
	bathrooms.innerHTML = `<span class="num2">${bathroom}</span> Bathrooms`;
	details.appendChild(bathrooms);

	const areaIcon = document.createElement("i");
	areaIcon.className = "fa-solid fa-chart-area";
	details.appendChild(areaIcon);

	const areas = document.createElement("p");
	areas.className = "area";
	areas.innerHTML = `<span class="num3">${area}</span> Sq Feet`;
	details.appendChild(areas);

	cardBody.appendChild(details);

	const hr2 = document.createElement("hr");
	cardBody.appendChild(hr2);

	const button = document.createElement("a");
	button.className = "btn btn-primary btn1";
	button.textContent = "View Details";
	cardBody.appendChild(button);

	button.addEventListener("click", (e) => {
		e.preventDefault();
		window.location = "#";
		return;
		let userName = document.getElementById("userName");
		button.href = `./items.html?username=${userName.textContent}&name=${propertyName}&type=${propertyType}`;
	});

	card.appendChild(cardBody);

	document.querySelector(container).appendChild(card);
}

document.querySelector("#liveToastBtn").addEventListener("click", function () {
	let toastEl = document.querySelector("#liveToast");
	let toast = new bootstrap.Toast(toastEl);
	toast.show();
});


const data = await getTransactionHistory();
createTableFromData(data);
createCardsFromData(data);
// tables done!!

getLikedCards(username);
// liked cards done too!!

const isSeller = await checkSeller();
if (isSeller) {
	const listings = await getUserListings();
	createCardFromListingsData(listings);
}
// listings done!!

let eWallet = document.querySelector(".e-wallet");
eWallet.addEventListener("click", () => {
	window.location = "#displayAll";
});

let transactionsHistory = document.querySelector(".transactions-history");
transactionsHistory.addEventListener("click", () => {
	window.location = "#transactionHistory";
});

let likedProperties = document.querySelector(".likedProperties");
likedProperties.addEventListener("click", () => {
	window.location = "#liked-properties";
});

let signOut = document.querySelector(".sign-out");
signOut.addEventListener("click", () => {
	window.location = "./landingpage.html";
});

const saveChangesButton = document.querySelector(".save-new-details-btn");

document.querySelectorAll(".inputBox").forEach(element => {
	element.addEventListener("input", () => {
		saveChangesButton.style.setProperty("display", "inline-block", "important");
	});
});

const saveChanges = async (Name, Username, Email, Phone) => {
	const newUsername = Username === "Enter Your Username" ? userDetails.userName : Username;
	const newName = Name === "Enter Your Name" ? userDetails.Name : Name;
	const newEmail = Email === "Enter Your Email" ? userDetails.userEmail : Email;
	const newPhone = Phone === "Enter Your Phone Number" ? userDetails.userPhone : Phone;
	const newDetails = { prevUsername: (userDetails.userName), Username: newUsername, Name: newName, Email: newEmail, Phone: newPhone };
	console.log(newDetails);
	const response = await fetch(serverURL + "/set-new-values", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(newDetails),
	});
	const data = await response.json();
	if (data === "Username Taken") {
		return false;
	}
	return true;
}

const sendOTP = async (username, email) => {
	console.log(username);
	console.log(email);
	const response = await fetch(serverURL + "/send-otp", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username, email }),
	});
	if (!response.ok) {
		console.log("Error while sending OTP!!");
		throw new Error(response.statusText);
	}
}

const verifyOTP = async (username, OTP) => {
	const response = await fetch(serverURL + "/verify-otp", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username, OTP })
	});
	if (!response.ok) {
		throw new Error(response.statusText);
	}
	const data = await response.json();
	return data;
}

saveChangesButton.addEventListener("click", async () => {
	const OTP = document.querySelector(".OTP-text");
	OTP.value = "";
	if (userDetails.userEmail !== "") {
		document.querySelector(".enter-otp-page").classList.remove("hide");
		await sendOTP(userDetails.userName, userDetails.userEmail);
	}
});

const confirmOTP = document.querySelector(".confirm-otp");
confirmOTP.addEventListener("click", async () => {
	const OTP = document.querySelector(".OTP-text");
	if (OTP.value.length === 6) {
		const correctOTP = await verifyOTP(userDetails.userName, OTP.value);
		if (correctOTP) {
			const saved = await saveChanges(document.querySelector(".name-input").textContent, document.querySelector(".userName-input").textContent, document.querySelector(".userEmail").textContent, document.querySelector(".userPhoneNumber").textContent);
			if (saved) {
				document.querySelector(".enter-otp-page").classList.add("hide");
				const setUserDetails = await fetch(serverURL + "/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ userName: document.querySelector(".userName-input").textContent, userEmail: document.querySelector(".userEmail").textContent, userProfilePicture: userDetails.userProfilePicture }),
					credentials: "include",
				});
				const data2 = await setUserDetails.json();
				localStorage.setItem("user details token", data2.token);
				await getUserDetails();
				saveChangesButton.style.display = "none";
			} else {
				alert("User Name Already Exists!!");
			}
		}
	} else {
		console.log("Invalid OTP");
	}
});

const cancelButton = document.querySelector(".cancel");
cancelButton.addEventListener("click", () => {
	document.querySelector(".enter-otp-page").classList.add("hide");
});
