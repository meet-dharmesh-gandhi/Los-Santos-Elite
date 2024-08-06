const { MongoClient } = require("mongodb");
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

dotenv.config({ path: path.join(__dirname, "../ENV Files/.env") });


const app = express();
const port = 3000;
const SERVER_URL = ["https://los-santos-elite-bbb4.vercel.app/", "https://los-santos-elite-1.onrender.com/"];

const HOST_URL = process.env.HOST_URL;
const MERCHANT_ID = process.env.MERCHANT_ID;
const SALT_INDEX = process.env.SALT_INDEX;
const SALT_KEY = process.env.SALT_KEY;
const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const PAYMENT_DATA = [];

const testProperties = {};

const secretKey = process.env.SESSION_SECRET_KEY;

app.use(session({
	secret: secretKey,
	resave: false,
	saveUninitialized: false,
	cookie: { secure: false, sameSite: true }
}));

app.use(cors({
	origin: ["https://los-santos-elite-1.onrender.com"],
	credentials: true
}));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const uri = process.env.DATABASE_URI;

const client = new MongoClient(uri);

const Building_Details = client.db("Feature_Testing").collection("Building Details");

const Usernames_and_Passwords = client.db("Feature_Testing").collection("Usernames and Passwords");

const Car_Details = client.db("Feature_Testing").collection("Car Details");

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

async function main() {
	try {
		await client.connect();
		console.log("Connected successfully to MongoDB");
	} catch (error) {
		console.error("Error connecting to MongoDB: ", error);
	}
}

main().catch(console.error);

async function getPropertyDetails(query) {
	const result = await Building_Details.find(query).toArray();
	return result;
}

async function addToCart(userName, Type, Name) {
	const newValue = {};
	newValue["cart." + Type] = Name;
	const result = await Usernames_and_Passwords.updateOne(
		{ username: userName },
		{ $push: newValue }
	);
	return result;
}

async function removeFromCart(userName, Type, Name) {
	const newValue = {};
	newValue["cart." + Type] = Name;
	const result = await Usernames_and_Passwords.updateOne(
		{ username: userName },
		{ $pull: newValue }
	);
	return result;
}

async function showCart(userName) {
	const result = await Usernames_and_Passwords.findOne(
		{ username: userName },
		{ cart: 1, _id: 0 }
	);
	return result;
}

async function deleteCart(userName) {
	const result = await Usernames_and_Passwords.updateMany({ username: userName }, { $set: { "cart": { car: [], building: [] } } });
	return result;
}

const addToWishlist = async (details) => {
	const { userName, propertyName } = details;
	const result = await Usernames_and_Passwords.updateOne(
		{ username: userName },
		{ $push: { wishlist: propertyName } }
	);
	return result;
};

const removeFromWishlist = async (details) => {
	const { userName, propertyName } = details;
	const result = await Usernames_and_Passwords.updateOne(
		{ username: userName },
		{ $pull: { wishlist: propertyName } }
	);
	return result;
};

const inArray = (item, array) => {
	for (let i = 0; i < array.length; i++) {
		element = array[i];
		if (element === item) {
			return true;
		}
	}
	return false;
};

async function stringOfFilters(filters) {
	const {
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
	} = filters;
	const query = {
		$and: [
			{ Price: { $lte: maxPrice } },
			{ Price: { $gte: minPrice } },
			{ Area: { $lte: maxArea } },
			{ Area: { $gte: minArea } },
			{ Rating: { $lte: maxRating } },
			{ Rating: { $gte: minRating } }
		]
	};
	if (type != "All") {
		query.$and.push({ Type: type });
	}
	// builderName, configuration, dealType and location are arrays
	if (builderName.length > 0) {
		query.$and.push({ "Builder Name": { $in: builderName } });
	}
	if (configuration.length > 0) {
		query.$and.push({ Configuration: { $in: configuration } });
	}
	if (!(inArray("Buy", dealType) && inArray("Rent", dealType))) {
		if (inArray("Buy", dealType)) {
			query.$and.push({ State: "For Purchase" });
		} else if (inArray("Rent", dealType)) {
			query.$and.push({ State: "For Rent" });
		}
	} else {
		query.$and.push({ State: "For Purchase and Rent" });
	}
	if (location.length > 0) {
		query.$and.push({ Location: { $in: location } });
	}
	return query;
}

async function addDocumentInDb(record) {
	const result = await Usernames_and_Passwords.insertOne(record);
	return result;
}

async function checkUserExistence(credentials) {
	const result = await Usernames_and_Passwords.find(credentials).toArray();
	return result;
}

async function filter(filters) {
	const query = await stringOfFilters(filters);
	const result = await Building_Details.find(query).toArray();
	return result;
}

async function getUniqueValues(values) {
	const groupObject = { _id: null };
	const projectList = [];
	for (let i = 0; i < values.length; i++) {
		groupObject[i] = { $addToSet: `$${values[i]}` };
		projectList.push(`$${i}`);
	}
	const projectObject = { _id: 0, "unique values": projectList };
	const result = await Building_Details.aggregate([
		{ $group: groupObject },
		{ $project: projectObject },
	]).toArray();
	return result[0]["unique values"];
}

async function getUserProfile(username) {
	const result = await Usernames_and_Passwords.find({ username }).toArray();
	return result;
}

async function setBuilderRating(details) {
	const { username, builderRatings, builderName } = details;
	let filter = {};
	const filterParam = "Builder Ratings." + builderName;
	filter[filterParam] = 1;
	filter["_id"] = 0;
	const previousUserRating = await Usernames_and_Passwords.findOne({ username: username }, filter)
	filter = {};
	filter[filterParam] = builderRatings;
	const updateUsername = await Usernames_and_Passwords.updateOne({ username: username }, { $set: filter });
	const averageBuilderRating = await Building_Details.findOne({ "Builder Name": builderName }, { "Rating": 1, "_id": 0 });
	let updatedBuilderRatings = ((2 * averageBuilderRating["Rating"]) + builderRatings - previousUserRating["Builder Ratings"][builderName]) / 2;
	const updateBuilderRatings = await Building_Details.updateMany({ "Builder Name": builderName }, { $set: { "Rating": updatedBuilderRatings } });
	return [updateUsername, updateBuilderRatings];
}

async function updateTransactionHistory(amounts, userName, quantities, fullDate) {
	const newTransaction = [amounts, quantities, fullDate];
	const result = await Usernames_and_Passwords.updateOne({ username: userName }, { $push: { "Transaction History": newTransaction } });
	return result;
}

async function getTransactionHistory(username) {
	const result = await Usernames_and_Passwords.findOne({ username }, { "Transaction History": 1, "_id": 0 });
	return result;
}

async function getListOfPrices(listOfNames) {
	const result = await Building_Details.find({ Name: { $in: listOfNames } }).toArray();
	return result;
}

async function getLikedProperties(username) {
	const likedPropertyNamesObject = await Usernames_and_Passwords.findOne({ username }, { "Liked Properties": 1, "_id": 0 });
	const likedPropertyNames = likedPropertyNamesObject.wishlist;
	const likedPropertyDetails = await Building_Details.find({ "Name": { $in: likedPropertyNames } }).toArray();
	return likedPropertyDetails;
}

async function getUserListings(username) {
	const result = await Usernames_and_Passwords.findOne({ username }, { "E Wallet.Listings": 1, "_id": 0 });
	const listings = result["E Wallet"]["Listings"];
	const propertyDetails = await Building_Details.find({ Name: { $in: listings } }).toArray();
	return propertyDetails;
}

async function getBoughtProperties(username) {
	const boughtPropertyNamesObject = await Usernames_and_Passwords.find({ username }, { "Transaction History": 1, "_id": 0 }).toArray();
	const boughtPropertyNames = [];
	boughtPropertyNamesObject[0]["Transaction History"].forEach((element) => {
		element[0].forEach((object) => {
			boughtPropertyNames.push(object);
		})
	})
	return boughtPropertyNames;
}

async function activateEWallet(username) {
	const result = await Usernames_and_Passwords.updateOne({ username }, { $set: { "E Wallet.Seller": true } });
	return result;
}

async function getDescriptions() {
	const result = await Building_Details.aggregate([
		{
			$group: {
				_id: null,
				"luxury": { $addToSet: "$Luxury Description" },
				"area": { $addToSet: "$Area Description" },
				"modern": { $addToSet: "$Modern Description" },
				"more": { $addToSet: "$More Description" },
				"nothing": { $addToSet: "$Nothing Description" }
			}
		},
		{
			$project: {
				_id: 0,
				"descriptions": ["$luxury", "$area", "$modern", "$more", "$nothing"]
			}
		},
	]).toArray();

	return result;
}

async function getCategories() {
	const result = await Building_Details.distinct("Type");
	return result;
}

async function getState() {
	const result = await Building_Details.distinct("State");
	return result;
}

async function getUniqueId(username) {
	return testProperties[username].length;
}

async function getSavedDetails(username, id) {
	for (let i = 0; i < testProperties[username].length; i++) {
		const element = testProperties[username][i];
		if (element._id === Number.parseInt(id)) {
			return element;
		}
	};
}

async function createNewListing(username, details) {
	const newListing = await Building_Details.insertOne(details);
	const updateUserListing = await Usernames_and_Passwords.updateMany({ username }, { $push: { "E Wallet.Listings": details } })
	return [newListing, updateUserListing];
}

function generateToken(user) {
	return jwt.sign(user, secretKey, { expiresIn: "1h" })
}

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

async function checkSeller(username) {
	const user = await Usernames_and_Passwords.findOne({ username, "E Wallet.Seller": false });
	return user ? false : true;
}

async function setPremiumType(username, premiumType) {
	const user = await Usernames_and_Passwords.updateMany({ username }, { $set: { "E Wallet.Premium Type": premiumType } });
	return user;
}

async function getSellerPremiumType(username) {
	const premiumType = await Usernames_and_Passwords.find({ username }, { "E Wallet.Premium Type": 1, "_id": 0 }).toArray();
	return premiumType[0]["E Wallet"]["Premium Type"];
}

async function setNewValues(prevUsername, Username, Name, Email, Phone) {
	const userNameTaken = await checkUserExistence({ username: Username });
	if (userNameTaken.length === 0) {
		const user = await Usernames_and_Passwords.updateMany({ username: prevUsername }, { $set: { username: Username, Name, "Email Address": Email, "Phone Number": Phone } });
		return user;
	}
	return "Username Taken";
}

function generateOTP() {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtp(username, email, OTP) {
	const mailOptions = {
		from: EMAIL_USERNAME,
		to: email,
		subject: "Los Santos Elite OTP",
		text: `Hello ${username}!!\nYour OTP is ${OTP} and will expire in 15 minutes.\nHappy Buying!!`
	};
	try {
		await transporter.sendMail(mailOptions);
		return true;
	} catch (error) {
		console.log(error);
		return error;
	}
}

async function storeOTP(username, OTP) {
	const user = await Usernames_and_Passwords.updateMany({ username }, { $set: { "OTP.createdAt": new Date(), "OTP.expiresAt": new Date(Date.now() + 15 * 60 * 1000), "OTP.OTP": OTP } });
	return user;
}

async function verifyOtp(username, OTP) {
	const user = await Usernames_and_Passwords.find({ username }).toArray();
	const timeNow = new Date();
	const OTPValid = timeNow.getTime() <= user[0].OTP.expiresAt.getTime();
	if (user[0].OTP.OTP === OTP && OTPValid) {
		return true;
	}
	return false;
}

async function getCarDetails(query) {
	const result = await Car_Details.find(query).toArray();
	return result;
}

async function getExtremeValues() {
	const result = await Building_Details.aggregate([{ $group: { _id: null, maxPrice: { $max: "$Price" }, minPrice: { $min: "$Price" }, maxArea: { $max: "$Area" }, minArea: { $min: "$Area" }, maxRating: { $max: "$Rating" }, minRating: { $min: "$Rating" } } }]).toArray();
	return result;
}









/*
API's start from here!!
*/









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
		let userDetails = await getUserProfile(userName);
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
		const existence = await checkUserExistence({ username: req.body.username });
		if (existence.length == 0) {
			await addDocumentInDb(req.body);
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
		const existence = await checkUserExistence(req.body);
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
		const result = await getPropertyDetails(propertyType);
		res.json(result);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

app.post("/get-specifics", async (req, res) => {
	try {
		const { Name, Type } = req.body;
		const result = await getPropertyDetails(req.body);
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
			const result = await addToCart(userName, type, name);
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
			const result = await removeFromCart(userName, type, name);
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
		const result = await deleteCart(userName);
		res.json(result);
	} catch (error) {
		console.log(error);
	}
})

app.post("/show-cart", async (req, res) => {
	try {
		const { userName } = req.body;
		const result = await showCart(userName);
		res.json(result);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

app.post("/filter-properties", async (req, res) => {
	try {
		const result = await filter(req.body);
		res.json(result);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

app.post("/get-unique-values", async (req, res) => {
	try {
		const { values } = req.body;
		const result = await getUniqueValues(values);
		res.json(result);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

app.post("/add-to-wishlist", async (req, res) => {
	try {
		const result = await addToWishlist(req.body);
		res.json(result);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

app.post("/remove-from-wishlist", async (req, res) => {
	try {
		const result = await removeFromWishlist(req.body);
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
		const userProfile = await getUserProfile(username);
		res.json(userProfile);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/set-builder-rating", async (req, res) => {
	try {
		const result = await setBuilderRating(req.body);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/get-list-of-prices", async (req, res) => {
	try {
		const { listOfPrices } = req.body;
		const result = await getListOfPrices(listOfPrices);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/get-transaction-history", async (req, res) => {
	try {
		const { username } = req.body;
		const result = await getTransactionHistory(username);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/update-transaction-history", async (req, res) => {
	try {
		const { amounts, userName, quantities, fullDate } = req.body;
		const result = await updateTransactionHistory(amounts, userName, quantities, fullDate);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/get-liked-properties", async (req, res) => {
	try {
		const { username } = req.body;
		const result = await getLikedProperties(username);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/get-user-listings", async (req, res) => {
	try {
		const { username } = req.body;
		const result = await getUserListings(username);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/get-bought-properties", async (req, res) => {
	try {
		const { username } = req.body;
		const result = await getBoughtProperties(username);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/activate-e-wallet", async (req, res) => {
	try {
		const { username } = req.body;
		const result = await activateEWallet(username);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.get("/get-descriptions", async (req, res) => {
	try {
		const result = await getDescriptions();
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.get("/get-categories", async (req, res) => {
	try {
		const result = await getCategories();
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.get("/get-states", async (req, res) => {
	try {
		const result = await getState();
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
		const result = await getUniqueId(username);
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
		const result = await getSavedDetails(username, id);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.put("/create-new-listing", async (req, res) => {
	try {
		const { username, details } = req.body;
		const result = await createNewListing(username, details);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/check-if-seller", async (req, res) => {
	try {
		const { username } = req.body;
		const result = await checkSeller(username);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

app.post("/set-premium-type", async (req, res) => {
	try {
		const { username, premiumType } = req.body;
		const result = await setPremiumType(username, premiumType);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/get-seller-premium-type", async (req, res) => {
	try {
		const { username } = req.body;
		const result = await getSellerPremiumType(username);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/set-new-values", async (req, res) => {
	try {
		const { prevUsername, Username, Name, Email, Phone } = req.body;
		const result = await setNewValues(prevUsername, Username, Name, Email, Phone);
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
		const result = await sendOtp(username, email, OTP);
		if (result === true) {
			const stored = await storeOTP(username, OTP);
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
		const result = await verifyOtp(username, OTP);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/get-car-details", async (req, res) => {
	try {
		const propertyType = req.body;
		const result = await getCarDetails(propertyType);
		res.json(result);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

app.get("/get-extreme-values", async (req, res) => {
	try {
		const result = await getExtremeValues();
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
		redirectUrl: `${SERVER_URL}/redirect-url/${merchantTransactionId}`,
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
					res.redirect(`http://127.0.0.1:${clientPort}/show%20cart.html?result=success&i=${PAYMENT_DATA.indexOf(response.data)}`);
				} else if (response.data.code === "PAYMENT_ERROR") {
					// go to error frontend
					res.redirect(`http://127.0.0.1:${clientPort}/show%20cart.html?result=failure&i=-1`);
				} else if (response.data.code === "INTERNAL_SERVER_ERROR") {
					// go to server error frontend
					res.redirect(`http://127.0.0.1:${clientPort}/show%20cart.html?result=internal-error&i=-1`);
				} else {
					// go to loading frontend
					res.redirect(`http://127.0.0.1:${clientPort}/show%20cart.html?result=loading&i=-1`);
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
		redirectUrl: `${SERVER_URL}/premium-redirect-url/${merchantTransactionId}/${amount}`,
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
