let USER_NAME = "";
const SERVER_URL = "https://los-santos-elite-1.onrender.com/";


const displayUserDetails = (userDetails) => {
    const userProfilePicture = document.querySelector("#userProfilePicture");
    userProfilePicture.src = userDetails.userProfilePicture;
    USER_NAME = userDetails.userName;
}

let userDetails;
const token = localStorage.getItem("user details token");
try {
    const getUserDetails = await fetch(`${SERVER_URL}/get-user-details`, {
        headers: { "Authorization": `Bearer ${token}` },
    });
    if (!getUserDetails.ok) {
        throw new Error("Error while getting user details");
    }
    userDetails = await getUserDetails.json();
    displayUserDetails(userDetails);
} catch (error) {
    console.error(error);
}

let details = {
    "_id": -1,
    "Type": "Example Type",
    "Name": "Example Name",
    "Location": "Example Location",
    "Configuration": 0,
    "Area": 0,
    "Builder Name": "Example Builder Name",
    "Builder Contact Number": "(123) 456-789",
    "Price": 0,
    "State": "Example State",
    "Images": ["URL", "URL", "URL", "URL", "URL"],
    "Rating": 2.5,
    "Luxury Description": "Example Luxury Description",
    "Area Description": "Example Area Description",
    "Modern Description": "Example Modern Description",
    "More Description": "Example More Description",
    "Nothing Description": "Example Nothing Description",
};

const defaultValues = {
    "_id": -1,
    "Type": "Example Type",
    "Name": "Example Name",
    "Location": "Example Location",
    "Configuration": 0,
    "Area": 0,
    "Builder Name": "Example Builder Name",
    "Builder Contact Number": "(123) 456-789",
    "Price": 0,
    "State": "Example State",
    "Images": ["URL", "URL", "URL", "URL", "URL"],
    "Rating": 2.5,
    "Luxury Description": "Example Luxury Description",
    "Area Description": "Example Area Description",
    "Modern Description": "Example Modern Description",
    "More Description": "Example More Description",
    "Nothing Description": "Example Nothing Description",
};

let checkDetailsChange = { ...details };

const checkSeller = async () => {
    const username = USER_NAME;
    const seller = await fetch(`${SERVER_URL}/check-if-seller`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
    });
    const isSeller = await seller.json();
    console.log(isSeller);
    //if (!isSeller) window.location.href = "../HTML Files/plan-selection-page.html";
}

const getSellerPremiumType = async () => {
    const response = await fetch(`${SERVER_URL}/get-seller-premium-type`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: USER_NAME }),
    });
    const premiumType = await response.json();
    console.log(premiumType === 3);
    return Number.parseInt(premiumType);
}

const getUniqueID = async () => {
    try {
        const response = await fetch(`${SERVER_URL}/get-unique-id`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: USER_NAME }),
        });
        if (!response.ok) {
            throw new Error("Something went wrong while getting ID");
        }
        const data = await response.json();
        details["_id"] = data;
    } catch (error) {
        console.log(error);
    }
}

const saveTestDetails = async (details) => {
    console.log("starting!!");
    if (details._id === 0) {
        await getUniqueID();
    }
    try {
        const response = await fetch(`${SERVER_URL}/save-test-details`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: USER_NAME, details }),
        });
    } catch (error) {
        console.log(error);
    }
    console.log("ending!!");
}

const generateDescriptions = async () => {
    try {
        const response = await fetch(`${SERVER_URL}/get-descriptions`);
        if (!response.ok) {
            throw new Error("Something went wrong while getting descriptions!!");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

const displayDescriptions = async () => {
    let descriptionsContainer;
    const descriptionsList = await generateDescriptions();
    const descriptionsArray = descriptionsList[0]["descriptions"];
    let descCount = 1;
    descriptionsArray.forEach((descriptions) => {
        let clickedDescription;
        let cnt = 1;
        if (descCount === 1) {
            descriptionsContainer = document.querySelector(".luxury-desc");
        } else if (descCount === 2) {
            descriptionsContainer = document.querySelector(".area-desc");
        } else if (descCount === 3) {
            descriptionsContainer = document.querySelector(".modern-desc");
        } else if (descCount === 4) {
            descriptionsContainer = document.querySelector(".more-desc");
        } else if (descCount === 5) {
            descriptionsContainer = document.querySelector(".nothing-desc");
        }
        descriptions.forEach((description) => {
            const p = document.createElement("p");
            const hr = document.createElement("hr");
            p.textContent = cnt + ") " + description;
            if (cnt != 1) {
                descriptionsContainer.appendChild(hr);
            }
            descriptionsContainer.appendChild(p);
            cnt++;
            ((descCount) => {
                p.addEventListener("click", () => {
                    console.log("clicked a p tag!!");
                    p.style.backgroundColor = "#77ff707d";
                    if (clickedDescription && clickedDescription != p) {
                        clickedDescription.style.backgroundColor = "#ffffff";
                    }
                    clickedDescription = p;
                    selectedDescriptions[Object.keys(details)[11 + descCount]] = p.textContent;
                });
            })(descCount);
            p.addEventListener("mouseenter", () => {
                if (clickedDescription != p) {
                    p.style.backgroundColor = "#ffef787d";
                }
            })
            p.addEventListener("mouseout", () => {
                if (clickedDescription != p) {
                    p.style.backgroundColor = "#ffffff";
                }
            })
        })
        descCount++;
    });
}

const displayCategories = async () => {
    try {
        const response = await fetch(`${SERVER_URL}/get-categories`);
        const data = await response.json();
        const propertyCategoryList = document.querySelector(".propertyCategoryList");
        data.forEach((category) => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.className = "dropdown-item";
            a.textContent = category;
            li.appendChild(a);
            propertyCategoryList.appendChild(li);
        });
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.className = "dropdown-item";
        a.textContent = "Other";
        li.appendChild(a);
        propertyCategoryList.appendChild(li);
    } catch (error) {
        console.log(error);
    }
}

const displayStates = async () => {
    try {
        const response = await fetch(`${SERVER_URL}/get-states`);
        const data = await response.json();
        const propertyStateList = document.querySelector(".propertyStateList");
        data.forEach((state) => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.className = "dropdown-item";
            a.textContent = state;
            li.appendChild(a);
            propertyStateList.appendChild(li);
        });
    } catch (error) {
        console.log(error);
    }
}

const loadFromSaved = async (id) => {
    try {
        const response = await fetch(`${SERVER_URL}/get-saved-details`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: USER_NAME, id }),
        });
        const data = await response.json();
        details = data;
    } catch (error) {
        console.log(error);
    }
}

await checkSeller();

await displayDescriptions();

await displayCategories();

await displayStates();

const premiumType = await getSellerPremiumType();

console.log(premiumType);

const saveTestDetailsInterval = setInterval(async () => {
    if (JSON.stringify(checkDetailsChange) !== JSON.stringify(details)) {
        checkDetailsChange = { ...details };
        console.log(details);
        await saveTestDetails(checkDetailsChange);
    }
}, 3000);


const writtenDescriptions = {};
const selectedDescriptions = {};
let requiredDescriptions = selectedDescriptions;
const selectDescriptions = document.querySelector(".select-desc");
const writeDescriptions = document.querySelector(".write-desc");
const writeDescriptionsContainer = document.querySelector(".write-own-desc");
const selectDescriptionsContainer = document.querySelector(".select-from-desc");
let userPreference = "select description";
const onlyForPremiumTag = document.querySelector(".only-premium");
selectDescriptions.addEventListener("click", () => {
    selectDescriptions.style.backgroundColor = "rgb(45, 254, 45)";
    writeDescriptions.style.backgroundColor = "rgb(254, 45, 45)";
    selectDescriptionsContainer.style.display = "block";
    writeDescriptionsContainer.style.display = "none";
    userPreference = "select description";
    requiredDescriptions = selectedDescriptions;
});
writeDescriptions.addEventListener("click", async () => {
    if (premiumType === 3) {
        writeDescriptions.style.backgroundColor = "rgb(45, 254, 45)";
        selectDescriptions.style.backgroundColor = "rgb(254, 45, 45)";
        writeDescriptionsContainer.style.display = "block";
        selectDescriptionsContainer.style.display = "none";
        userPreference = "write description";
        requiredDescriptions = writtenDescriptions;
    }
});

if (onlyForPremiumTag.classList.contains("apply-only-premium") && premiumType === 3) {
    onlyForPremiumTag.classList.remove("apply-only-premium");
}

writeDescriptionsContainer.childNodes.forEach(element => {
    element.addEventListener("input", (e) => {
        let finalText = "", lastIndex = 0;
        let text = element.value;
        const spaces = text.split(" ").length - 1;
        if (spaces > 40) {
            e.preventDefault();
            if (finalText === "") {
                lastIndex = countTillSpace(text, 40);
                console.log(lastIndex);
                finalText = text.slice(0, lastIndex);
            }
            element.value = finalText;
        } else {
            finalText = "";
            lastIndex = 0;
        }
        writtenDescriptions[element.name] = element.value;
    })
})

let input = document.querySelector(".propertyCategoryInput");
let list = document.querySelectorAll(".propertyCategoryList li a");
const otherCategory = document.querySelector(".otherCategory");
const otherCategoryText = document.querySelector(".other-property-category");
const propertyType = document.querySelector(".card-property-type");
list.forEach((element) => {
    element.addEventListener("click", () => {
        input.value = element.innerText;
        if (input.value == "Other") {
            otherCategory.style.display = "block";
            details["Type"] = propertyType.textContent = "Category";
            otherCategoryText.addEventListener("input", () => {
                if (otherCategoryText.value === "") {
                    details["Type"] = propertyType.textContent = "Category";
                } else {
                    details["Type"] = propertyType.textContent = otherCategoryText.value;
                }
            })
        }
        else {
            otherCategory.style.display = "none";
            details["Type"] = propertyType.textContent = element.innerText;
        }
    });
});

const countTillSpace = (text, num) => {
    let count = 0;
    text = text.split(" ");
    for (let i = 0; i < num; i++) {
        count += text[i].length + 1
    }
    count--;
    return count;
}

let input1 = document.querySelector(".propertyStateInput");
let list1 = document.querySelectorAll(".propertyStateList li a");
list1.forEach((element) => {
    element.addEventListener("click", () => {
        details["State"] = input1.value = element.innerText;
    });
});

let propertyName = document.querySelector("#inputPropertyName");
let cardTitle = document.querySelector(".card-title");
propertyName.addEventListener("input", () => {
    if (propertyName.value === "") {
        details["Name"] = cardTitle.innerText = "Example Mansion";
    }
    else {
        details["Name"] = cardTitle.innerText = propertyName.value;
    }
});

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
        numberString = trimString(number.slice(0, number.length - 6)) + "." + trimString(number.slice(number.length - 6, number.length - 1)) + " M";
    } else if (number.slice(number.length - 3, number.length) === "000") {
        numberString = number.slice(0, number.length - 3) + " K";
    } else {
        numberString = number;
    }
    return numberString;
};

let price = document.querySelector("#inputPrice");
let cardPrice = document.querySelector(".card-price");
price.addEventListener("input", () => {
    let price_int = parseInt(price.value);
    let select1 = document.querySelector(".select1");
    let select2 = document.querySelector(".select2");
    let accordion1 = document.querySelector(".accordion1");
    let accordion2 = document.querySelector(".accordion2");
    if (price.value === "") {
        cardPrice.innerText = "Some Price";
        details["Price"] = 0;
    }
    else {
        cardPrice.innerText = "$" + numberToString(price.value);
        details["Price"] = Number.parseFloat(price.value);
    }
    if (price_int >= 1000000) {
        select1.style.display = "block";
        accordion1.style.display = "block";
        select2.style.display = "none";
        accordion2.style.display = "none";
    }
});

let configuration = document.querySelector("#inputConfiguration");
let num1 = document.querySelector(".num1");
let num2 = document.querySelector(".num2");
configuration.addEventListener("input", () => {
    if (configuration.value === "") {
        num2.innerText = num1.innerText = "x";
        details["Configuration"] = 0;
    }
    else {
        num2.innerText = num1.innerText = details["Configuration"] = Number.parseInt(configuration.value);
    }
});

let area = document.querySelector("#inputPropertArea");
let num3 = document.querySelector(".num3");
area.addEventListener("input", () => {
    if (area.value === "") {
        num3.innerText = "xyz";
        details["Area"] = 0;
    }
    else {
        num3.innerText = numberToString(area.value);
        details["Area"] = Number.parseFloat(area.value);
    }
});

let cardLocation = document.querySelector("#inputLocation");
let propertyLocation = document.querySelector(".location");
cardLocation.addEventListener("input", () => {
    if (cardLocation.value === "") {
        details["Location"] = propertyLocation.innerText = "Example location";
    }
    else {
        details["Location"] = propertyLocation.innerText = cardLocation.value;
    }
});

const builderFirstName = document.querySelector(".builder-first-name");
const builderSecondName = document.querySelector(".builder-second-name");
let builderName = [];

builderFirstName.addEventListener("input", () => {
    if (builderFirstName.value === "") {
        builderName[0] = "Example";
    } else {
        builderName[0] = builderFirstName.value;
    }
    details["Builder Name"] = builderName.join(" ");
});

builderSecondName.addEventListener("input", () => {
    if (builderSecondName.value === "") {
        builderName[1] = "Builder";
    } else {
        builderName[1] = builderSecondName.value;
    }
    details["Builder Name"] = builderName.join(" ");
})

const stringToPhoneNumber = (phoneNumber) => {
    let phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength >= 1) {
        phoneNumber = "(" + phoneNumber;
        phoneNumberLength++;
    }
    if (phoneNumberLength >= 5) {
        phoneNumber = phoneNumber.slice(0, 4) + ") " + phoneNumber.slice(4, phoneNumberLength);
        phoneNumberLength++;
        phoneNumberLength++;
    }
    if (phoneNumberLength >= 10) {
        phoneNumber = phoneNumber.slice(0, 9) + "-" + phoneNumber.slice(9, phoneNumberLength);
    }
    if (phoneNumberLength >= 13) {
        phoneNumber = phoneNumber.slice(0, 13);
    }
    return phoneNumber;
}

const extractNumbers = (phoneNumber) => {
    return phoneNumber.replace(/[^0-9]/g, '');
}

const builderContactNumber = document.querySelector(".builder-contact-number");
builderContactNumber.addEventListener("input", (e) => {
    const input = e.target;
    const value = input.value;
    const filteredValue = value.replace(/[^0-9\s\-\(\)]/g, "");
    if (filteredValue !== value) {
        input.value = filteredValue;
    }
    const newValue = stringToPhoneNumber(extractNumbers(filteredValue));
    input.value = newValue;
    if (filteredValue === "") {
        details["Builder Contact Number"] = "(123) 456-789";
    } else {
        details["Builder Contact Number"] = newValue;
    }
});

const pictures = document.querySelectorAll(".pictures");
for (let i = 0; i < pictures.length; i++) {
    const picture = pictures[i];
    picture.addEventListener("change", (e) => {
        const image = e.target.files[0];
        if (image) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageUrl = e.target.result;
                details["Images"][i] = imageUrl;
                console.log(imageUrl);
                if (i === 0) {
                    document.querySelector(".front-view-image").src = imageUrl;
                }
            };
            reader.readAsDataURL(image);
        } else {
            const imageUrl = "";
            details["Images"][i] = imageUrl
            document.querySelector(".front-view-image").src = imageUrl;
        }
    });
};

const visitWebsiteButton = document.querySelector(".visit-website");
visitWebsiteButton.addEventListener("click", async (e) => {
    e.preventDefault();
    clearInterval(saveTestDetailsInterval);
    await saveTestDetails(details);
    window.open(`../HTML Files/items-page.html?test=true&id=${details._id}`, "_blank");
});

const checkForEmptyFields = () => {
    for (let i = 0; i < Object.keys(details).length; i++) {
        const element = Object.keys(details)[i];
        console.log(element);
        console.log(i);
        const elementValue = details[element];
        const defaultElementValue = defaultValues[element];
        if (elementValue === defaultElementValue && i !== 10 && i !== 11 && i !== 0 && i !== 13 && i !== 14 && i !== 15 && i !== 16 && i !== 12) {
            alert(`Please fill in the "${element}" field.`);
            return false;
        } else if (i === 10) {
            if (JSON.stringify(elementValue) === JSON.stringify(defaultElementValue)) {
                alert(`Please upload all the images in the "Insert Images" section.`);
                return false;
            }
        }
    }
    return true;
}

const addDescriptions = () => {
    console.log(userPreference);
    console.log(selectedDescriptions);
    if (userPreference === "select description") {
        if (Object.keys(selectedDescriptions).length < 5) {
            alert("Please fill in all the descriptions.");
            return false;
        }
        for (let element in selectedDescriptions) {
            details[element] = selectedDescriptions[element];
        }
    } else if (userPreference === "write description") {
        if (Object.keys(writtenDescriptions).length < 5) {
            alert("Please fill in all the descriptions.");
            return false;
        }
        for (let element in writtenDescriptions) {
            details[element] = writtenDescriptions[element];
        }
    }
    return true;
}

const createListingButton = document.querySelector(".create-listing-button");
createListingButton.addEventListener("click", async () => {
    if (!checkForEmptyFields()) return;
    if (!addDescriptions()) return;
    const { _id, ...reqDetails } = details;
    try {
        const result = await fetch(`${SERVER_URL}/create-new-listing`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: USER_NAME, details: reqDetails }),
        });
        const data = await result.json();
        console.log(data);
        if (data[0].acknowledged) {
            alert("Listing created successfully");
        } else {
            alert("Failed to create listing");
        }
    } catch (error) {
        console.error(error);
    }
});