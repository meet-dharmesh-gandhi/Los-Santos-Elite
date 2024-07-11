// Home Page Scroll Effect
window.addEventListener('scroll', function() {
    let navbar = document.querySelector('.navbar');
    let logo = document.querySelector(".logo p");
    var firstImageHeight = document.querySelector('.bg-image1').offsetHeight;
    var secondImageHeight = document.querySelector('.bg-image2').offsetHeight;
    var thirdImageHeight = document.querySelector('.bg-image3').offsetHeight;
    var totalHeight = firstImageHeight + secondImageHeight + thirdImageHeight;
    if (window.scrollY >= totalHeight) {
        navbar.classList.add('fixed');
        logo.classList.add('hidden');
    } else {
        navbar.classList.remove('fixed');
        logo.classList.remove('hidden');
    }
});

// Click Events
let mansions = document.querySelector(".bg-image2 h1");
mansions.addEventListener("click", () => {
    window.location.href = "#mansion";
});

let penthouses = document.querySelector(".bg-image3 h1");
penthouses.addEventListener("click", () => {
    window.location.href = "#penthouse";
});

let mansionsTab = document.querySelector("#mansion-tab");

mansionsTab.addEventListener("click", () => {
    document.querySelector(".container3").innerHTML = "";
    // Creating Mansion Cards
    console.log("Printed");
    imgOneSrc = ["./images/mansion4.jpg","./images/mansion4.jpg","./images/mansion4.jpg","./images/mansion4.jpg","./images/mansion4.jpg","./images/mansion4.jpg"];
    propertyName = ["Mansion 1", "Mansion 2","Mansion 3", "Mansion 4","Mansion 5", "Mansion 6"];
    price = ["$200,000","$500,000","$200,000","$500,000","$200,000","$500,000"];
    Locations = ["Rockford Hills", "Vinewood Hills","Rockford Hills", "Vinewood Hills","Rockford Hills", "Vinewood Hills"];
    bedroom = ["3","2","3","2","3","2"];
    bathroom = ["3","2","3","2","3","2"];
    area = ["500", "400", "300", "600", "700", "800"];

    for(let i = 0; i < 5; i++) {
        createCard(imgOneSrc[i],propertyName[i],price[i],Locations[i],bedroom[i],bathroom[i],area[i]);
        if(i === 0) {
            addRightArrowIcon();
            addLeftArrowIcon();
        }
    }
});

let penthousesTab = document.querySelector("#penthouse-tab");

penthousesTab.addEventListener("click", () => {
    document.querySelector(".container3").innerHTML = "";
    // Creating Mansion Cards
    console.log("Printed");
    imgOneSrc = ["./images/mansion4.jpg","./images/mansion4.jpg","./images/mansion4.jpg","./images/mansion4.jpg","./images/mansion4.jpg","./images/mansion4.jpg"];
    propertyName = ["Penthouse 1", "Penthouse 2","Penthouse 3", "Penthouse 4","Penthouse 5", "Penthouse 6"];
    price = ["$200,000","$500,000","$200,000","$500,000","$200,000","$500,000"];
    Locations = ["Rockford Hills", "Vinewood Hills","Rockford Hills", "Vinewood Hills","Rockford Hills", "Vinewood Hills"];
    bedroom = ["3","2","3","2","3","2"];
    bathroom = ["3","2","3","2","3","2"];
    area = ["500", "400", "300", "600", "700", "800"];

    for(let i = 0; i < 5; i++) {
        createCard(imgOneSrc[i],propertyName[i],price[i],Locations[i],bedroom[i],bathroom[i],area[i]);
        if(i === 0) {
            addRightArrowIcon();
            addLeftArrowIcon();
        }
    }
});

let apartmentsTab = document.querySelector("#apartment-tab");

apartmentsTab.addEventListener("click", () => {
    document.querySelector(".container3").innerHTML = "";
    // Creating Mansion Cards
    console.log("Printed");
    imgOneSrc = ["./images/mansion4.jpg","./images/mansion4.jpg","./images/mansion4.jpg","./images/mansion4.jpg","./images/mansion4.jpg","./images/mansion4.jpg"];
    propertyName = ["Apartment 1", "Apartment 2","Apartment 3", "Apartment 4","Apartment 5", "Apartment 6"];
    price = ["$200,000","$500,000","$200,000","$500,000","$200,000","$500,000"];
    Locations = ["Rockford Hills", "Vinewood Hills","Rockford Hills", "Vinewood Hills","Rockford Hills", "Vinewood Hills"];
    bedroom = ["3","2","3","2","3","2"];
    bathroom = ["3","2","3","2","3","2"];
    area = ["500", "400", "300", "600", "700", "800"];

    for(let i = 0; i < 5; i++) {
        createCard(imgOneSrc[i],propertyName[i],price[i],Locations[i],bedroom[i],bathroom[i],area[i]);
        if(i === 0) {
            addRightArrowIcon();
            addLeftArrowIcon();
        }
    }
});

function createCard(imgSrc, propertyName, price, Locations, bedroom, bathroom, area) {

    const card = document.createElement('div');
    card.className = 'card col-lg-3';
    card.style.width = '18rem';
    card.id = 'card1';

    const img = document.createElement('img');
    img.src = imgSrc;
    img.className = 'card-img-top';
    card.appendChild(img);

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.textContent = propertyName;
    cardBody.appendChild(cardTitle);

    const cardText = document.createElement('p');
    cardText.className = 'card-price';
    cardText.textContent = price;
    cardBody.appendChild(cardText);

    const location = document.createElement('p');
    location.className = 'location';
    location.textContent = Locations;
    cardBody.appendChild(location);

    const hr1 = document.createElement('hr');
    cardBody.appendChild(hr1);

    const details = document.createElement('div');
    details.className = 'details';

    const bedIcon = document.createElement('i');
    bedIcon.className = 'fa-solid fa-bed';
    details.appendChild(bedIcon);

    const bedrooms = document.createElement('p');
    bedrooms.className = 'bedrooms';
    bedrooms.innerHTML = `<span class="num1">${bedroom}</span> Bedrooms`;
    details.appendChild(bedrooms);

    const bathIcon = document.createElement('i');
    bathIcon.className = 'fa-solid fa-bath';
    details.appendChild(bathIcon);

    const bathrooms = document.createElement('p');
    bathrooms.className = 'bathrooms';
    bathrooms.innerHTML = `<span class="num2">${bathroom}</span> Bathrooms`;
    details.appendChild(bathrooms);

    const areaIcon = document.createElement('i');
    areaIcon.className = 'fa-solid fa-chart-area';
    details.appendChild(areaIcon);

    const areas = document.createElement('p');
    areas.className = 'area';
    areas.innerHTML = `<span class="num3">${area}</span> Sq Feet`;
    details.appendChild(areas);

    cardBody.appendChild(details);

    const hr2 = document.createElement('hr');
    cardBody.appendChild(hr2);

    const button = document.createElement('a');
    button.href = '#';
    button.className = 'btn btn-primary';
    button.textContent = 'View Details';
    cardBody.appendChild(button);

    card.appendChild(cardBody);

    document.querySelector(".container3").appendChild(card);
}

// Left and Right Arrow for Cards
function addRightArrowIcon() {
    let rightArrow = document.createElement('i');
    rightArrow.className = 'fa-solid fa-circle-chevron-right';
    rightArrow.style.display = 'block';
    document.querySelector(".container3").append(rightArrow);
    let icon1 = document.querySelector(".fa-circle-chevron-right");
    icon1.addEventListener("click", function() {
    let container = document.querySelector(".container3");
    container.scrollBy({
        left: 1330,
        behavior: 'smooth'
    });
});
}

function addLeftArrowIcon() {
    let leftArrow = document.createElement('i');
    leftArrow.className = 'fa-solid fa-circle-chevron-left';
    leftArrow.style.display = 'none';
    document.querySelector(".container3").append(leftArrow);
    let icon2 = document.querySelector(".fa-circle-chevron-left");
    icon2.addEventListener("click", function() {
    let container = document.querySelector(".container3");
    container.scrollBy({
        left: -1330,
        behavior: 'smooth'
    });
});
}

let container = document.querySelector(".container3");
container.addEventListener('scroll', function() {
    let icon2 = document.querySelector(".fa-circle-chevron-left");

    if (container.scrollLeft > 0) {
        icon2.style.display = 'block';
    } 
    else {
        icon2.style.display = 'none';
    }
});

container.addEventListener('scroll', function() {
    let icon1 = document.querySelector(".fa-circle-chevron-left");

    if (container.scrollLeft > 0) {
        icon1.style.display = 'block';
    } 
    else {
        icon1.style.display = 'none';
    }
});

// Search Bar
let searchInput = document.querySelector(".search-input");
let searchButton = document.querySelector(".search-button");
searchButton.addEventListener("click", () => {
    let searchInputValue = searchInput.value;
    let input = searchInputValue.toLowerCase();
    if(input[(input.length)-1] === 's') {
        newInput = input.slice(0,-1);
        window.location.href = `#${newInput}`;
    }
    else {
        window.location.href = `#${input}`;
    }
});

searchInput.addEventListener("keypress", (event) => {
    if(event.key == "Enter") {
        searchButton.click();
    }
});

window.addEventListener('scroll', () => {
    const mansionSection = document.querySelector('.mansion');
    const sectionPosition = mansionSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.5;

    if (sectionPosition < screenPosition) {
        mansionSection.classList.add('visible');
    }
});