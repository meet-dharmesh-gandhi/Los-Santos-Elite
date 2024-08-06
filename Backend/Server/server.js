const express = require("express");
const axios = require("axios");
const uniqid = require("uniqid");
const sha256 = require("sha256");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { connectDB, db } = require("../Config/db.js")
const ServerFunctions = require("./server functions");

dotenv.config({ path: path.join(__dirname, "../ENV Files/.env") });


const app = express();
const port = 3000;

const HOST_URL = process.env.HOST_URL;
const MERCHANT_ID = process.env.MERCHANT_ID;
const SALT_INDEX = process.env.SALT_INDEX;
const SALT_KEY = process.env.SALT_KEY;
const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const PAYMENT_DATA = [];

const testProperties = {};

const secretKey = process.env.SESSION_SECRET_KEY;

const clientURL = "http://127.0.0.1:5500";

app.use(session({
	secret: secretKey,
	resave: false,
	saveUninitialized: false,
	cookie: { secure: false, sameSite: true }
}));

app.use(cors({
	origin: clientURL,
	credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	auth: {
		user: EMAIL_USERNAME,
		pass: EMAIL_PASSWORD
	}
});

transporter.verify((error, success) => {
	if (error) {
		console.log(error);
	} else {
		console.log("Done!!");
		console.log(success);
	}
})

async function startServer() {
	await connectDB();
}

main().catch(console.error);




function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token === null) return res.sendStatus(401);
	jwt.verify(token, secretKey, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
}



app.post("/user-email-exists", async (req, res) => {
	try {
		const { Email } = req.body;
		const userDetails = await checkUserExistence({ "Email Address": Email });
		res.send([userDetails.length !== 0 ? "true" : "false", userDetails]);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
})

app.post("/login", async (req, res) => {
	try {
		let { userName, userEmail, userProfilePicture } = req.body;
		if (userProfilePicture === "default") {
			userProfilePicture = process.env.DEFAULT_PROFILE_PICTURE;
		}
		let userDetails = await ServerFunctions.getUserProfile(userName);
		let userPhone = userDetails[0]["Phone Number"];
		let Name = userDetails[0]["Name"];
		const user = { Name, userName, userEmail, userProfilePicture, userPhone };

		const token = generateToken(user);
		res.json({ token });
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

app.get("/get-user-details", authenticateToken, async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

app.post("/add-new-user", async (req, res) => {
	try {
		const existence = await ServerFunctions.checkUserExistence({ username: req.body.username });
		if (existence.length == 0) {
			await ServerFunctions.addDocumentInDb(req.body);
			res.json("User Added!!");
		} else {
			res.json("Username Exists!!");
		}
	} catch (error) {
		console.error("Error while adding user: ", error);
		res.status(500).send(error);
	}
});

app.post("/check-user-existence", async (req, res) => {
	try {
		const existence = await ServerFunctions.checkUserExistence(req.body);
		if (existence.length == 0) {
			res.json("Incorrect Username or Password");
		} else {
			res.json("User Verified!!");
		}
	} catch (error) {
		console.error("Error verifying: ", error);
		res.status(500).send(error);
	}
});

app.post("/get-property-details", async (req, res) => {
	try {
		const propertyType = req.body;
		const result = await ServerFunctions.getPropertyDetails(propertyType);
		res.json(result);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

app.post("/get-specifics", async (req, res) => {
	try {
		const { Name, Type } = req.body;
		const result = await ServerFunctions.getPropertyDetails(req.body);
		res.json(result);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

app.post("/add-to-cart", async (req, res) => {
	try {
		const { userName, type, name } = req.body;
		if (type === "building" || type === "car") {
			const result = await ServerFunctions.addToCart(userName, type, name);
			res.json(result);
		} else {
			res.status(400).send("Invalid Type");
		}
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

app.post("/remove-from-cart", async (req, res) => {
	try {
		const { userName, type, name } = req.body;
		if (type === "building" || type === "car") {
			const result = await ServerFunctions.removeFromCart(userName, type, name);
			res.json(result);
		} else {
			res.status(400).send("Invalid Type");
		}
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

app.post("/delete-cart", async (req, res) => {
	try {
		const { userName } = req.body;
		const result = await ServerFunctions.deleteCart(userName);
		res.json(result);
	} catch (error) {
		console.log(error);
	}
})

app.post("/show-cart", async (req, res) => {
	try {
		const { userName } = req.body;
		const result = await ServerFunctions.showCart(userName);
		res.json(result);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

app.post("/filter-properties", async (req, res) => {
	try {
		const result = await ServerFunctions.filter(req.body);
		res.json(result);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

app.post("/get-unique-values", async (req, res) => {
	try {
		const { values } = req.body;
		const result = await ServerFunctions.getUniqueValues(values);
		res.json(result);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

app.post("/add-to-wishlist", async (req, res) => {
	try {
		const result = await ServerFunctions.addToWishlist(req.body);
		res.json(result);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

app.post("/remove-from-wishlist", async (req, res) => {
	try {
		const result = await ServerFunctions.removeFromWishlist(req.body);
		res.json(result);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

app.post("/search", async (req, res) => {
	try {
		const { Searched } = req.body;
		const names = await Building_Details.distinct("Name");
		const types = await Building_Details.distinct("Type");
		const locations = await Building_Details.distinct("Location");
		const configurations = await Building_Details.distinct("Configuration");
		const areas = await Building_Details.distinct("Area");
		const builderNames = await Building_Details.distinct("Builder Name");
		const prices = await Building_Details.distinct("Price");
		const states = await Building_Details.distinct("State");
		let searchedNames,
			searchedTypes,
			searchedLocations,
			searchedConfigurations,
			searchedAreas,
			searchedBuilderNames,
			searchedPrices,
			searchedStates;
		searchedNames = names.filter((name) =>
			name.toLowerCase().includes(Searched.toLowerCase())
		);
		searchedTypes = types.filter((type) =>
			type.toLowerCase().includes(Searched.toLowerCase())
		);
		searchedLocations = locations.filter((location) =>
			location.toLowerCase().includes(Searched.toLowerCase())
		);
		searchedConfigurations = configurations.filter((configuration) =>
			Searched.toLowerCase().includes(configuration.toString().toLowerCase())
		);
		searchedAreas = areas.filter((area) =>
			Searched.toLowerCase().includes(area.toString().toLowerCase())
		);
		searchedBuilderNames = builderNames.filter((builderName) =>
			builderName.toLowerCase().includes(Searched.toLowerCase())
		);
		searchedPrices = prices.filter((price) =>
			Searched.toLowerCase().includes(price.toString().toLowerCase())
		);
		searchedStates = states.filter((state) =>
			state.toLowerCase().includes(Searched.toLowerCase())
		);
		const searchQuery = { $or: [] };
		if (searchedNames.length != 0) {
			searchQuery["$or"].push({ "Name": { $in: searchedNames } });
		}
		if (searchedTypes.length != 0) {
			searchQuery["$or"].push({ "Type": { $in: searchedTypes } });
		}
		if (searchedLocations.length != 0) {
			searchQuery["$or"].push({ "Location": { $in: searchedLocations } });
		}
		if (searchedConfigurations.length != 0) {
			searchQuery["$or"].push({ "Configuration": { $in: searchedConfigurations } });
		}
		if (searchedBuilderNames.length != 0) {
			searchQuery["$or"].push({ "Builder Name": { $in: searchedBuilderNames } });
		}
		if (searchedPrices.length != 0) {
			searchQuery["$or"].push({ "Price": { $in: searchedPrices } });
		}
		if (searchedStates.length != 0) {
			searchQuery["$or"].push({ "State": { $in: searchedStates } });
		}
		if (searchQuery.$or.length !== 0) {
			const searchResults = await Building_Details.find(searchQuery).toArray();
			res.json(searchResults);
		} else {
			res.json([]);
		}
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/get-user-profile", async (req, res) => {
	try {
		const { username } = req.body;
		const userProfile = await ServerFunctions.getUserProfile(username);
		res.json(userProfile);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/set-builder-rating", async (req, res) => {
	try {
		const result = await ServerFunctions.setBuilderRating(req.body);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/get-list-of-prices", async (req, res) => {
	try {
		const { listOfPrices } = req.body;
		const result = await ServerFunctions.getListOfPrices(listOfPrices);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/get-transaction-history", async (req, res) => {
	try {
		const { username } = req.body;
		const result = await ServerFunctions.getTransactionHistory(username);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/update-transaction-history", async (req, res) => {
	try {
		const { amounts, userName, quantities, fullDate } = req.body;
		const result = await ServerFunctions.updateTransactionHistory(amounts, userName, quantities, fullDate);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/get-liked-properties", async (req, res) => {
	try {
		const { username } = req.body;
		const result = await ServerFunctions.getLikedProperties(username);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/get-user-listings", async (req, res) => {
	try {
		const { username } = req.body;
		const result = await ServerFunctions.getUserListings(username);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/get-bought-properties", async (req, res) => {
	try {
		const { username } = req.body;
		const result = await ServerFunctions.getBoughtProperties(username);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/activate-e-wallet", async (req, res) => {
	try {
		const { username } = req.body;
		const result = await ServerFunctions.activateEWallet(username);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.get("/get-descriptions", async (req, res) => {
	try {
		const result = await ServerFunctions.getDescriptions();
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.get("/get-categories", async (req, res) => {
	try {
		const result = await ServerFunctions.getCategories();
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.get("/get-states", async (req, res) => {
	try {
		const result = await ServerFunctions.getState();
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/get-unique-id", async (req, res) => {
	try {
		const { username } = req.body;
		if (!Object.keys(testProperties).includes(username)) {
			testProperties[username] = [];
		}
		const result = await ServerFunctions.getUniqueId(username);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/save-test-details", async (req, res) => {
	try {
		const { username, details } = req.body;
		if (!Object.keys(testProperties).includes(username)) {
			testProperties[username] = [];
			testProperties[username].push(details);
		} else if (testProperties[username].length === Number.parseInt(details._id)) {
			testProperties[username].push(details);
		} else {
			testProperties[username][Number.parseInt(details._id)] = details;
		}
		res.json({ status: "done" });
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/get-saved-details", async (req, res) => {
	try {
		const { username, id } = req.body;
		const result = await ServerFunctions.getSavedDetails(username, id);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.put("/create-new-listing", async (req, res) => {
	try {
		const { username, details } = req.body;
		const result = await ServerFunctions.createNewListing(username, details);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/check-if-seller", async (req, res) => {
	try {
		const { username } = req.body;
		const result = await ServerFunctions.checkSeller(username);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

app.post("/set-premium-type", async (req, res) => {
	try {
		const { username, premiumType } = req.body;
		const result = await ServerFunctions.setPremiumType(username, premiumType);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/get-seller-premium-type", async (req, res) => {
	try {
		const { username } = req.body;
		const result = await ServerFunctions.getSellerPremiumType(username);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/set-new-values", async (req, res) => {
	try {
		const { prevUsername, Username, Name, Email, Phone } = req.body;
		const result = await ServerFunctions.setNewValues(prevUsername, Username, Name, Email, Phone);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error)
	}
});

app.post("/send-otp", async (req, res) => {
	try {
		const { username, email } = req.body;
		const OTP = generateOTP();
		const result = await ServerFunctions.sendOtp(username, email, OTP);
		if (result === true) {
			const stored = await ServerFunctions.storeOTP(username, OTP);
			if (!stored) {
				res.status(400).send({ message: "Failed to store OTP" });
			}
		}
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/verify-otp", async (req, res) => {
	try {
		const { username, OTP } = req.body;
		const result = await ServerFunctions.verifyOtp(username, OTP);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/get-car-details", async (req, res) => {
	try {
		const propertyType = req.body;
		const result = await ServerFunctions.getCarDetails(propertyType);
		res.json(result);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

app.get("/get-extreme-values", async (req, res) => {
	try {
		const result = await ServerFunctions.getExtremeValues();
		res.json(result);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
})

app.get("/", (req, res) => {
	res.send("PhonePe is On!!");
});

app.get("/pay/:amount", async (req, res) => {
	const payEndpoint = "/pg/v1/pay";
	const amount = Number.parseInt(req.params.amount);
	const merchantTransactionId = uniqid();
	const userId = 123;
	const payLoad = {
		merchantId: MERCHANT_ID,
		merchantTransactionId: merchantTransactionId,
		merchantUserId: "MUID" + userId,
		name: "meet",
		amount,
		redirectUrl: `http://localhost:${port}/redirect-url/${merchantTransactionId}`,
		redirectMode: "POST",
		mobileNumber: "9999999999",
		paymentInstrument: { type: "PAY_PAGE" },
	};

	const bufferObj = Buffer.from(JSON.stringify(payLoad));
	const base64EncodedPayLoad = bufferObj.toString("base64");
	const xVerify = sha256(base64EncodedPayLoad + payEndpoint + SALT_KEY) + "###" + SALT_INDEX;

	const options = {
		method: "POST",
		url: `${HOST_URL}${payEndpoint}`,
		headers: {
			accept: "application/json",
			"Content-Type": "application/json",
			"X-VERIFY": `${xVerify}`,
		},
		data: { request: base64EncodedPayLoad },
	};
	axios
		.request(options)
		.then(function (response) {
			const url = response.data.data.instrumentResponse.redirectInfo.url;
			console.log("url: " + url);
			res.redirect(url);
		})
		.catch(function (error) {
			console.error(error.response);
		});
});

app.get("/redirect-url/:merchantTransactionId", (req, res) => {
	const { merchantTransactionId } = req.params;
	const xVerify = sha256(`/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + SALT_KEY) + "###" + SALT_INDEX;
	if (merchantTransactionId) {
		const options = {
			method: "GET",
			url: `${HOST_URL}/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`,
			headers: {
				accept: "application/json",
				"Content-Type": "application/json",
				"X-VERIFY": xVerify,
				"X-MERCHANT-ID": `${MERCHANT_ID}`,
			},
		};
		axios
			.request(options)
			.then(function (response) {
				const clientPort = 5500;
				if (response.data.code === "PAYMENT_SUCCESS") {
					// go to success frontend
					PAYMENT_DATA.push(response.data);
					res.redirect(`${clientURL}/show%20cart.html?result=success&i=${PAYMENT_DATA.indexOf(response.data)}`);
				} else if (response.data.code === "PAYMENT_ERROR") {
					// go to error frontend
					res.redirect(`${clientURL}/show%20cart.html?result=failure&i=-1`);
				} else if (response.data.code === "INTERNAL_SERVER_ERROR") {
					// go to server error frontend
					res.redirect(`${clientURL}/show%20cart.html?result=internal-error&i=-1`);
				} else {
					// go to loading frontend
					res.redirect(`${clientURL}/show%20cart.html?result=loading&i=-1`);
				}
			})
			.catch(function (error) {
				console.error(error);
			});
	} else {
		res.send({ error: "No merchantTransactionId found." });
	}
});

app.get("/pay-premium/:amount", async (req, res) => {
	const payEndpoint = "/pg/v1/pay";
	const amount = Number.parseInt(req.params.amount);
	const merchantTransactionId = uniqid();
	const userId = 123;
	const payLoad = {
		merchantId: MERCHANT_ID,
		merchantTransactionId: merchantTransactionId,
		merchantUserId: userId,
		amount,
		redirectUrl: `http://localhost:${port}/premium-redirect-url/${merchantTransactionId}/${amount}`,
		redirectMode: "REDIRECT",
		mobileNumber: "9999999999",
		paymentInstrument: { type: "PAY_PAGE" },
	};

	const bufferObj = Buffer.from(JSON.stringify(payLoad), "utf8");
	const base64EncodedPayLoad = bufferObj.toString("base64");
	const xVerify =
		sha256(base64EncodedPayLoad + payEndpoint + SALT_KEY) + "###" + SALT_INDEX;

	const options = {
		method: "POST",
		url: `${HOST_URL}${payEndpoint}`,
		headers: {
			accept: "application/json",
			"Content-Type": "application/json",
			"X-VERIFY": xVerify,
		},
		data: {
			request: base64EncodedPayLoad,
		},
	};
	axios
		.request(options)
		.then(function (response) {
			const url = response.data.data.instrumentResponse.redirectInfo.url;
			res.redirect(url);
		})
		.catch(function (error) {
			// console.error(error);
		});
});

app.get("/premium-redirect-url/:merchantTransactionId/:amount", (req, res) => {
	const { merchantTransactionId } = req.params;
	const amount = Number.parseInt(req.params.amount);
	const xVerify = sha256(`/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + SALT_KEY) + "###" + SALT_INDEX;
	if (merchantTransactionId) {
		const options = {
			method: "get",
			url: `${HOST_URL}/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`,
			headers: {
				accept: "application/json",
				"Content-Type": "application/json",
				"X-VERIFY": xVerify,
				"X-MERCHANT-ID": merchantTransactionId,
			},
		};
		axios
			.request(options)
			.then(function (response) {
				if (response.data.code === "PAYMENT_SUCCESS") {
					res.redirect(`http://127.0.0.1:5500/HTML Files/plan-selection-page.html?status=Payment%20Successful%20${amount}`);
				} else {
					res.redirect(`http://127.0.0.1:5500/HTML Files/plan-selection-page.html?status=Payment%20Failed%20${amount}`);
				}
			})
			.catch(function (error) {
				// console.error(error);
			});
	} else {
		res.send({ error: "No merchantTransactionId found." });
	}
});

app.post("/get-payment-data", async (req, res) => {
	let { i } = req.body;
	i = Number.parseInt(i);
	res.json(PAYMENT_DATA[i]);
	PAYMENT_DATA.splice(i, 1);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
