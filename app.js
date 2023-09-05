let userLocation;

window.onload = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
        });
    }
}


const searchButton = document.getElementById("search-button");
 async function getList(){
    
    const searchInput = document.getElementById("search-input").value.trim();
   const url=`https://airbnb13.p.rapidapi.com/search-location?location=${searchInput}&checkin=2023-09-16&checkout=2023-09-17&adults=1&children=0&infants=0&pets=0&page=1&currency=USD`;
   const options={
    method: "GET",
    headers: {
      "X-RapidAPI-Key":
        "e72a6478cemshfca8a0744c3bc2dp182cf2jsnbca1138eccda",
      "X-RapidAPI-Host": "airbnb13.p.rapidapi.com",
    },
  };
    const response =await fetch(url,options);
   const data= await response.json();
   const dataList = data.results;
   console.log(dataList);

   const listingsContainer = document.getElementById("listings-container");

    // Clear previous listings
    listingsContainer.innerHTML = "";

    // Append new listings
    dataList.forEach(listing => {
        const listingCard = createListingCard(listing);
        listingsContainer.append(listingCard);
    });

 }

   function createListingCard(listing) {
       
          
  const listingCard = document.createElement("div");
  listingCard.classList.add("listing-card");
  

  listingCard.innerHTML = `
      <img src="${listing.images[0]}" alt="${listing.name}" class="list-image">
      <div class="listing-info">
          <h2 class="title">${listing.name}</h2>
          <p>${listing.type} · ${listing.beds} beds · ${listing.bathrooms} bathrooms</p>
          <p>${listing.price.total} per night</p>
          <p>${listing.address}</p>
        
         
      </div>
  `;
  // Add a button for booking cost breakdown
  const costButton = document.createElement("button");
  costButton.innerText = "Show Booking Cost Breakdown";
  costButton.addEventListener("click", () => showBookingCostBreakdown(listing));
  listingCard.appendChild(costButton);

  
    // Add a paragraph for the reviews count and average rating
    const reviewsP = document.createElement("p");
    reviewsP.innerHTML = `Reviews: ${listing.reviewsCount} | Average Rating: ${listing.rating}`;
    listingCard.appendChild(reviewsP);

    // Add a superhost indicator if the host is a superhost
    if (listing.isSuperhost) {
        const superhostIndicator = document.createElement("p");
        superhostIndicator.innerText = "Superhost";
        superhostIndicator.style.color = "red";
        listingCard.appendChild(superhostIndicator);
    }
    if (listing.rareFind) {
        const rareFindIndicator = document.createElement("p");
        rareFindIndicator.innerText = "Rare Find";
        rareFindIndicator.style.color = "green";
        listingCard.appendChild(rareFindIndicator);
    }
      // Add an amenities preview
    const amenitiesPreview = document.createElement("p");
    amenitiesPreview.innerText = `Amenities: ${createAmenitiesPreview(listing.previewAmenities)}`;
    listingCard.appendChild(amenitiesPreview);

      

  // Add a directions button
      const directionsButton = document.createElement("button");
    directionsButton.innerText = "Get Directions";
    directionsButton.addEventListener("click", function() {
        openDirections(listing.lat, listing.lng);
    });
    listingCard.appendChild(directionsButton);


   

  return  listingCard;

}

let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 }, // Centered at some default location
        zoom: 8
    });
}

function showBookingCostBreakdown(listing) {
    // Calculate additional fees and total cost
    const additionalFees = listing.price.total * 0.10; // Assuming additional fees are 10% of base price
    const totalCost = listing.price.total + additionalFees;

    // Create a modal dialog box
    const modal = document.createElement("div");
    modal.style.display = "block";
    modal.style.width = "300px";
    modal.style.height = "200px";
    modal.style.backgroundColor = "#fff";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.padding = "20px";
    modal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";

    // Add booking cost breakdown to the modal
    
    modal.innerHTML = `
        <h2>Booking Cost Breakdown</h2>
        <p>Base Rate: $${listing.price.total}</p>
        <p>Additional Fees: $${additionalFees}</p>
        <p>Total Cost: $${totalCost}</p>
    `;

    // Add a close button to the modal
    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.addEventListener("click", () => modal.style.display = "none");
    modal.appendChild(closeButton);

    // Add the modal to the body
    document.body.appendChild(modal);
}



function createAmenitiesPreview(amenities) {
    // Show the first 3 amenities and the total count
    const previewAmenities = amenities.slice(0, 3);
    let previewText = previewAmenities.join(", ");

    if (amenities.length > 3) {
        const extraCount = amenities.length - 3;
        previewText += `, and ${extraCount} more`;
    }

    return previewText;
}

function openDirections(latitude,longitude) {
    // Open Google Maps directions in a new tab
    const url = `https://www.google.com/maps/dir//${latitude},${longitude}`;
    window.open(url, "_blank");
}




