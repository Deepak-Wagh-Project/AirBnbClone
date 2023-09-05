//google map api key - AIzaSyBC-b23wDnuP-bnSWXFN-MxTjE81y0UlEM

let map;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: parseFloat(12.971599), lng: parseFloat(77.594566) }, // Centered at some default location
    zoom: 8,
  });
}

let userLocation;

window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }
};
window.addEventListener("DOMContentLoaded", (event) => {
  // map init

  // Your code goes here
  const searchButton = document.getElementById("search-button");

  searchButton.addEventListener("click", () => {
    //map

    const searchInput = document.getElementById("search-input").value;
    ///// api.example has to be replaced with rapid api

    //////////

    async function fetchapi() {
      const url = `https://airbnb13.p.rapidapi.com/search-location?location=${searchInput}&checkin=2023-09-16&checkout=2023-09-17&adults=1&children=0&infants=0&pets=0&page=1&currency=USD`;
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "e72a6478cemshfca8a0744c3bc2dp182cf2jsnbca1138eccda",
          "X-RapidAPI-Host": "airbnb13.p.rapidapi.com",
        },
      };

      await fetch(url, options)
        .then(async (response) => {
          await response.json().then((result) => {
            console.log(result);
            console.log("success.api");
            const listingsContainer =
              document.getElementById("listings-container");

            // Clear previous listings
            listingsContainer.innerHTML = "";

            // Append new listings
            let count = 0;

            result.results.slice(0, 10).forEach(async (listing) => {
              if (count > 10) {
              }

              const listingCard = await createListingCard(listing);
              listingsContainer.appendChild(listingCard);
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
    fetchapi();

    //createlistingcard function:

    async function createListingCard(listing) {
      //   // location listing

      //   const listingLocation = `${listing.lat},${listing.lng}`;

      //   fetch(
      //     `http://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${userLocation.lat},${userLocation.lng}&destinations=${listingLocation}&key=AIzaSyBC-b23wDnuP-bnSWXFN-MxTjE81y0UlEM`
      //   )
      //     .then((response) => response.json())
      //     .then((data) => {
      //       const distance = data.rows[0].elements[0].distance.text;

      //       // Now create the listingCard and include the distance in the information

      //     });

      //     console.log(userLocation,listing.lat,listing.lng);

      let distance;

      async function mycurlocation() {
        var service = new google.maps.DistanceMatrixService();
        await service
          .getDistanceMatrix({
            origins: [
              {
                lat: parseFloat(userLocation.lat.toFixed(5)),
                lng: parseFloat(userLocation.lng.toFixed(5)),
              },
            ],
            destinations: [
              { lat: parseFloat(listing.lat), lng: parseFloat(listing.lng) },
            ],
            travelMode: "DRIVING",
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false,
          })
          .then((response1) => {
            distance = response1.rows[0].elements[0].distance.text;
            console.log(response1.rows[0].elements[0].distance);
            console.log(response1.rows[0].elements[0].distance.text);
          });
      }
      await mycurlocation();

      // var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(userLocation.lat.toFixed(5), userLocation.lng.toFixed(5)), new google.maps.LatLng(listing.lat, listing.lng));
      console.log("distance", distance);

      const listingCard = document.createElement("div");
      listingCard.classList.add("listing-card");

      listingCard.innerHTML = `
                      <img src="${listing.images[0]}" alt="${listing.name}">
                      <div class="listing-info">
                          <h2>${listing.name}</h2>
                          <p>${listing.type} · ${listing.beds} beds · ${
        listing.bathrooms
      } bathrooms</p>
                          <p>${listing.price.rate} per night</p>
                          <p>${listing.city}</p>
                          <p>Amenities: ${listing.previewAmenities.join(
                            ", "
                          )}</p>
                      </div>
                    
                       <p>Distance from you: ${distance}</p>
            
        `;

      new google.maps.Marker({
        position: {
          lat: parseFloat(listing.lat),
          lng: parseFloat(listing.lng),
        },
        map,
        title: listing.name,
      });

      //show bookingcostbreakdown

      function showBookingCostBreakdown(listing) {
        // Calculate additional fees and total cost
        const additionalFees = listing.price.rate * 0.1; // Assuming additional fees are 10% of base price
        const totalCost = listing.price.rate + additionalFees;

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
        <p>Base Rate: $${listing.price.rate.toFixed(2)}</p>
        <p>Additional Fees: $${additionalFees.toFixed(2)}</p>
        <p>Total Cost: $${totalCost.toFixed(2)}</p>
    `;

        // Add a close button to the modal
        const closeButton = document.createElement("button");
        closeButton.innerText = "Close";
        closeButton.addEventListener(
          "click",
          () => (modal.style.display = "none")
        );
        modal.appendChild(closeButton);

        // Add the modal to the body
        document.body.appendChild(modal);
      }

      const costButton = document.createElement("button");
      costButton.innerText = "Show Booking Cost Breakdown";
      costButton.addEventListener("click", () =>
        showBookingCostBreakdown(listing)
      );
      listingCard.appendChild(costButton);

      //Reviews and Ratings

      

      const reviewsP = document.createElement("p");
      reviewsP.innerHTML = `Reviews: ${
        listing.reviewsCount
      } | Average Rating: ${listing.rating}`;
      listingCard.appendChild(reviewsP);


      //super host

      if (listing.isSuperhost) {
        const superhostIndicator = document.createElement("p");
        superhostIndicator.innerText = "Superhost";
        superhostIndicator.style.color = "red";
        listingCard.appendChild(superhostIndicator);
    }


    //rare find

    if (listing.rareFind) {
        const rareFindIndicator = document.createElement("p");
        rareFindIndicator.innerText = "Rare Find";
        rareFindIndicator.style.color = "green";
        listingCard.appendChild(rareFindIndicator);
    }


    //listing amenities

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

    const amenitiesPreview = document.createElement("p");
    amenitiesPreview.innerText = `Amenities: ${createAmenitiesPreview(listing.previewAmenities)}`;
    listingCard.appendChild(amenitiesPreview);


    //host details

    function createHostDetails(host,superhost) {
        // Include the host's name and 'Superhost' status
        let hostText = host;
    
        if (superhost) {
            hostText += " (Superhost)";
        }
    
        return hostText;
    }
    const hostDetails = document.createElement("p");
    hostDetails.innerText = `Hosted by ${createHostDetails(listing.name,listing.isSuperhost)}`;
    listingCard.appendChild(hostDetails);


    //directions to property

    function openDirections(location) {
        // Open Google Maps directions in a new tab
        const url = `https://www.google.com/maps/dir//${location.lat},${location.lng}`;
        window.open(url, "_blank");
    }

    const directionsButton = document.createElement("button");
    directionsButton.innerText = "Get Directions";
    directionsButton.addEventListener("click", function() {
        openDirections(listing);
    });
    listingCard.appendChild(directionsButton);


      return listingCard;
    }
  });
});
