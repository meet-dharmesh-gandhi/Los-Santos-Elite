const SERVER_HOST_URL = "http://localhost:3000/";
const apiEndPoints = [
    "get-car-specifics",
    "get-saved-details",
    "get-user-profile",
    "set-builder-rating",
    "get-car-specifics",
    "add-to-cart",
    "remove-from-cart"
];

export async function getCarDetails(name, type) {
    try {
        const response = await fetch(`${SERVER_HOST_URL}${apiEndPoints[0]}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ Name: name, Type: type }),
        });
        if (!response.ok) {
            throw new Error(
                "HTTP error while retrieving specifics " + response.status
            );
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching details: ", error);
    }
};

export async function getTestDetails(id) {
    try {
        const response = await fetch(`${SERVER_HOST_URL}${apiEndPoints[1]}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: USER_NAME, id }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

export async function getUserProfile(username) {
    try {
        const response = await fetch(`${SERVER_HOST_URL}${apiEndPoints[2]}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
        });
        if (!response.ok) {
            throw new Error("Error getting user profile " + response.status);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching user profile: ", error);
    }
};

export async function setBuilderRating(rating, builderName) {
    try {
        const response = await fetch(`${SERVER_HOST_URL}${apiEndPoints[3]}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: USER_NAME,
                builderRatings: rating,
                builderName,
            }),
        });
        if (!response.ok) {
            throw new Error("Error setting builder rating " + response.status);
        }
        const data = await response.json();
    } catch (error) {
        console.error("Error setting builder rating: ", error);
    }
};

export async function getOnlyPropertyDetails(brand) {
    try {
        const response = await fetch(
            `${SERVER_HOST_URL}${apiEndPoints[4]}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ "Brand": brand }),
            }
        );
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

export async function removeFromCart(USER_NAME, name) {
    try {
        const response = await fetch(`${SERVER_HOST_URL}${apiEndPoints[5]}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName: USER_NAME,
                type: "car",
                name,
            }),
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
    } catch (error) {
        console.error("Error while removing from cart: ", error);
    }
}

export async function addToCart(USER_NAME, name) {
    try {
        const response = await fetch(`${SERVER_HOST_URL}${apiEndPoints[6]}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName: USER_NAME,
                type: "car",
                name,
            }),
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
    } catch (error) {
        console.error("Error while adding to cart: ", error);
    }
}