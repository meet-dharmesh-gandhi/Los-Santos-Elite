import { getElement } from "./utility-functions.js";

const SERVER_HOST_URL = "http://localhost:3000";
const apiEndPoints = [
    "get-extreme-car-values",
    "get-unique-car-values",
    "search-cars",
    "filter-cars",
    "get-car-details",
    "add-to-wishlist",
    "remove-from-wishlist"
];


export async function setExtremeValues(minPriceInput, maxPriceInput, minNumberOfSeatsInput, maxNumberOfSeatsInput, minMileageInput, maxMileageInput, document) {
    const values = await fetch(`${SERVER_HOST_URL}/${apiEndPoints[0]}`);
    const extremeValues = await values.json();
    getElement(minPriceInput, document).textContent = extremeValues[0].minPrice;
    getElement(maxPriceInput, document).textContent = extremeValues[0].maxPrice;
    getElement(minNumberOfSeatsInput, document).textContent = extremeValues[0].minNumberOfSeats;
    getElement(maxNumberOfSeatsInput, document).textContent = extremeValues[0].maxNumberOfSeats;
    getElement(minMileageInput, document).textContent = extremeValues[0].minMileage;
    getElement(maxMileageInput, document).textContent = extremeValues[0].maxMileage;
}

export async function getAttributes(attributes) {
    try {
        const result = await fetch(`${SERVER_HOST_URL}/${apiEndPoints[1]}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ values: attributes }),
        });
        const data = await result.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export async function getSearchedProperties(Searched) {
    try {
        const response = await fetch(`${SERVER_HOST_URL}/${apiEndPoints[2]}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ Searched }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export async function filterCars(
    type,
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
) {
    try {
        const response = await fetch(`${SERVER_HOST_URL}/${apiEndPoints[3]}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type,
                minPrice,
                maxPrice,
                minNumberOfSeats,
                maxNumberOfSeats,
                minRating,
                maxRating,
                minMileage,
                maxMileage,
                brand,
                engineType,
                configuration,
                color,
            }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export async function getPropertyDetails(propertyType, loader) {
    loader.style.display = "block";
    try {
        const response = await fetch(`${SERVER_HOST_URL}/${apiEndPoints[4]}`, {
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
    } finally {
        loader.style.display = "none";
    }
};

export async function getAllPropertyDetails(loader) {
    loader.style.display = "block";
    try {
        const response = await fetch(`${SERVER_HOST_URL}/${apiEndPoints[4]}`, {
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
        return data;
    } catch (error) {
        console.error("Error fetching details: ", error);
        console.log(error.message);
    }
    loader.style.display = "none";
};

export async function addToWishlist(propertyName) {
    try {
        const userName = document.getElementById("user-name");
        const response = await fetch(`${SERVER_HOST_URL}/${apiEndPoints[5]}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userName: userName.textContent, carName }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function removeFromWishlist(propertyName) {
    try {
        const userName = document.getElementById("user-name");
        const response = await fetch(`${SERVER_HOST_URL}/${apiEndPoints[6]}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userName: userName.textContent, carName }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}