export function createCarCard(
    imgSrc,
    carName,
    price,
    carBrand,
    carType,
    carPower,
    carMileage,
    carTopSpeed,
    isMobileScreen
) {
    const card = document.createElement("div");
    card.className = "card col-6 col-md-6 col-lg-3";
    card.id = "card1";

    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = carName;
    img.className = "card-img-top";
    card.appendChild(img);

    const likeButton = document.createElement("div");
    likeButton.className = "like-button";
    const likeButtonText = document.createElement("i");
    likeButtonText.className = "fa-regular fa-heart";
    likeButton.appendChild(likeButtonText);
    likeButton.addEventListener("click", () => {
        if (likeButtonText.classList.contains("fa-regular")) {
            likeButtonText.classList.remove("fa-regular");
            likeButtonText.classList.add("fa-solid");
            addToWishlist(propertyName);
        } else {
            likeButtonText.classList.remove("fa-solid");
            likeButtonText.classList.add("fa-regular");
            removeFromWishlist(propertyName);
        }
        likeButtonText.classList.toggle("liked");
    });
    card.appendChild(likeButton);

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const cardTitle = document.createElement("h5");
    cardTitle.className = "card-title";
    cardTitle.textContent = carName;
    cardBody.appendChild(cardTitle);

    if (!isMobileScreen) {
        const cardText = document.createElement("p");
        cardText.className = "card-price";
        cardText.textContent = numberToString(price);
        cardBody.appendChild(cardText);

        const brand = document.createElement("p");
        brand.className = "brand";
        brand.textContent = carBrand;
        cardBody.appendChild(brand);

        const type = document.createElement("p");
        type.className = "car-type";
        type.textContent = carType;
        cardBody.appendChild(type);

        const hr1 = document.createElement("hr");
        cardBody.appendChild(hr1);

        const details = document.createElement("div");
        details.className = "details";

        const horsepowerIcon = document.createElement("i");
        horsepowerIcon.className = "fa-brands fa-superpowers";
        details.appendChild(horsepowerIcon);

        const power = document.createElement("p");
        power.className = "power";
        power.innerHTML = `<span class="num1">${carPower}</span> Hp`;
        details.appendChild(power);

        const carIcon = document.createElement("i");
        carIcon.className = "fa-solid fa-car";
        details.appendChild(carIcon);

        const mileage = document.createElement("p");
        mileage.className = "mileage";
        mileage.innerHTML = `<span class="num2">${carMileage}</span> kmpl`;
        details.appendChild(mileage);

        const speedIcon = document.createElement("i");
        speedIcon.className = "fa-solid fa-bolt";
        details.appendChild(speedIcon);

        const topSpeed = document.createElement("p");
        topSpeed.className = "topSpeed";
        topSpeed.innerHTML = `<span class="num3">${carTopSpeed}</span> Km/h`;
        details.appendChild(topSpeed);

        cardBody.appendChild(details);

        const hr2 = document.createElement("hr");
        cardBody.appendChild(hr2);
    } else {
        document.createComment("some details start from here!!");

        const someDetails = document.createElement("div");
        someDetails.className = "someDetails";
        cardBody.appendChild(someDetails);


        // left side
        const leftSide = document.createElement("div");
        leftSide.className = "left-side";
        someDetails.appendChild(leftSide);

        const cardPrice = document.createElement("p");
        cardPrice.className = "card-price";
        cardPrice.textContent = numberToString(price);
        leftSide.appendChild(cardPrice);

        const brand = document.createElement("p");
        brand.className = "brand";
        brand.textContent = carBrand;
        leftSide.appendChild(brand);

        const type = document.createElement("p");
        type.className = "car-type";
        type.textContent = carType;
        leftSide.appendChild(type);


        // vertical line
        const verticalLine = document.createElement("div");
        verticalLine.className = "vertical-line";
        someDetails.appendChild(verticalLine);


        //right side
        const rightSide = document.createElement("div");
        rightSide.className = "right-side";
        someDetails.appendChild(rightSide);

        // first quality1
        const quality1E1 = document.createElement("div");
        quality1E1.className = "quality1";
        quality1E1.innerHTML = `<i class="fa-solid fa-bed"></i>`;
        rightSide.appendChild(quality1E1);

        const bedrooms = document.createElement("p");
        bedrooms.className = "bedrooms";
        quality1E1.appendChild(bedrooms);

        const num1E = document.createElement("span");
        num1E.className = "num1";
        num1E.textContent = `${bedroom} bedrooms`;
        bedrooms.appendChild(num1E);

        // second quality1
        const quality1E2 = document.createElement("div");
        quality1E2.className = "quality1";
        quality1E2.innerHTML = `<i class="fa-solid fa-bed"></i>`;
        rightSide.appendChild(quality1E2);

        const bathrooms = document.createElement("p");
        bathrooms.className = "bathrooms";
        quality1E2.appendChild(bathrooms);

        const num2E = document.createElement("span");
        num2E.className = "num2";
        num2E.textContent = `${bathroom} bathrooms`;
        bathrooms.appendChild(num2E);

        // third quality1
        const quality1E3 = document.createElement("div");
        quality1E3.className = "quality1";
        quality1E3.innerHTML = `<i class="fa-solid fa-bed"></i>`;
        rightSide.appendChild(quality1E3);

        const areas = document.createElement("p");
        areas.className = "area";
        quality1E3.appendChild(areas);

        const num3E = document.createElement("span");
        num3E.className = "num3";
        num3E.textContent = `${area} areas`;
        areas.appendChild(num3E);

        for (let i = 0; i < 2; i++) {
            cardBody.appendChild(document.createElement("hr"));
        }
    }

    const button = document.createElement("a");
    button.className = "btn btn-primary btn1";
    button.textContent = "View Details";
    cardBody.appendChild(button);

    button.addEventListener("click", () => {
        button.href = `../HTML Files/items-page.html?name=${propertyName}&type=${propertyType}`;
    });

    card.appendChild(cardBody);

    document.querySelector(".container3").appendChild(card);
}
