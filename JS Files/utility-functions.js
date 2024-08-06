export function setProperty(element, toSet, value) {
    if (value) {
        element[toSet] = value;
    }
}

export function createElement(tag, parent, properties, document) {
    const selectedProperties = Object.keys(properties);
    let element = document.createElement(tag);
    for (let i = 0; i < selectedProperties.length; i++) {
        const property = selectedProperties[i];
        const value = properties[property];
        setProperty(element, `${property}`, value);
    }
    parent.appendChild(element);
    return element;
}

export function numberToString(number) {
    let numberString = "";
    number = number.toString();
    if (number.slice(number.length - 6, number.length) === "000000") {
        numberString = number.slice(0, number.length - 7) + " M";
    } else if (number.length > 6) {
        numberString =
            number.slice(0, number.length - 6) +
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

export function trimString(numberString) {
    while (numberString[numberString.length - 1] == "0") {
        numberString = numberString.slice(0, -1);
    }
    return numberString;
};

export async function getUserDetails() {
    const token = localStorage.getItem("user details token");
    try {
        const getUserDetails = await fetch("http://localhost:3000/get-user-details", {
            headers: { "Authorization": `Bearer ${token}` },
        });
        if (!getUserDetails.ok) {
            throw new Error("Error while getting user details");
        }
        let userDetails = await getUserDetails.json();
        return userDetails;
    } catch (error) {
        redirectTo("../HTML Files/sign-in-page.html");
    }
}

export function setUserDetails(userDetails, userName, userProfilePicture, userEmail, document) {
    if (userName) {
        document.querySelector(userName).textContent = userDetails.userName;
    }
    if (userProfilePicture) {
        document.querySelector(userProfilePicture).src = userDetails.userProfilePicture;
    }
    if (userEmail) {
        document.querySelector(userEmail).textContent = userDetails.userEmail;
    }
}

export function checkScreenSize(isMobileScreen, clickedTab, window) {
    let handleScreenSize = (e) => {
        if (e.matches && !isMobileScreen) {
            clickedTab.click();
            return true;
        } else if (!e.matches && isMobileScreen) {
            clickedTab.click();
            return false;
        }
        return false;
    };

    let isMobileScreenNow = false;

    const mediaQuery = window.matchMedia('(max-width: 431px)');
    mediaQuery.addEventListener("change", () => { isMobileScreenNow = handleScreenSize(mediaQuery) });
    if (isMobileScreenNow) {
        return true;
    }
    return false;
}

Object.prototype.getLength = function () {
    return Object.keys(this).length;
}

Object.prototype.elementAt = function (index) {
    return this[Object.keys(this)[index]];
}

Object.prototype.keyAt = function (index) {
    return Object.keys(this)[index];
}

export function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function redirectTo(location) {
    window.location.href = location;
}

export function getElement(element, document) {
    return document.querySelector(element);
}

export function load(loader) {
    loader.style.display = "block";
}

export function unLoad(loader) {
    loader.style.display = "none";
}

export function getSibling(siblingNumber, element) {
    return element.parentNode.children[siblingNumber];
}
