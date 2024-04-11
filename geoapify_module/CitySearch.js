async function getAccessToken() {
    const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials&client_id=vpZpJHun8Sgh5qHDCoJdbrnBZJsYsqGV&client_secret=ylKl1aNGF9Jh8TdH'
    });
    const data = await response.json();
    return data.access_token;
}

async function AirportAndCitySearch(accessToken, countryCode, cityName) {
    return await fetch(`https://test.api.amadeus.com/v1/reference-data/locations/cities?countryCode=${countryCode}&keyword=${cityName}&max=10`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
}

async function citycoordinates(catagory) {
  try {
      const accessToken = await getAccessToken();
      const cityName = document.getElementById('destinationInput').value;
      const countryCode = 'IN';

      const cityResponse = await AirportAndCitySearch(accessToken, countryCode, cityName);

      if (!cityResponse.ok) {
          throw new Error(`Failed to fetch city data: ${cityResponse.statusText}`);
      }

      const cityData = await cityResponse.json();
      const lati = cityData.data[0].geoCode.latitude;
      const longi = cityData.data[0].geoCode.longitude;
      catagory =catagory.slice(0, -1);

      
      let iplocation;
      getLocationInfo()
      .then(locationInfo => {
        // Do something with locationInfo
        iplocation=locationInfo;
        console.log(locationInfo);
      })
      .catch(error => {
        console.error('Error:', error);
      });

      // const yourLocation=getLocationInfo();
      // console.log(yourLocation);

      const placesData=await getPlacesFromGeoapify(lati, longi,catagory);
      var data1 = placesData;
      localStorage.setItem('data1', JSON.stringify(data1));

      const flightdata=await searchFlightOffers(cityName);
      var data2=flightdata;
      localStorage.setItem('data2', JSON.stringify(data2));


      hotelcatagory='accommodation.hotel';
      const hotelData=await getPlacesFromGeoapify(lati, longi,hotelcatagory);
      var data3 = hotelData;
      localStorage.setItem('data3', JSON.stringify(data3));
      // Display places when the page loads
      window.location.href = "geoapify_module/display.html";
     
      // window.onload = function() {
      //    // Display the retrieved data
      //   };
       

  } catch (error) {
      console.error('Error:', error);
  }
}

let category = '';

document.addEventListener('DOMContentLoaded', function() {
  // Get all buttons
  var buttons = document.querySelectorAll('#interestsDiv');

  // Add event listener to each button
  buttons.forEach(function(button) {
      button.addEventListener('click', function(event) {
          var buttonId = event.target.id;
          if(buttonId!="interestsDiv"){
            category += `${buttonId},`;
            event.target.classList.add('highlighted');
          }
          // Remove the 'highlighted' class from all buttons
          // buttons.forEach(function(btn) {
          //     btn.classList.remove('highlighted');
          // });
          event.target.disabled=true;
          // Add the 'highlighted' class to the clicked button
          console.log(category); // Log category after button click
      });
  });
});


// // Main function to initialize the application
// function initializeApp() {
// //   // Add event listener to the form
// //   document.getElementById('destinationForm').addEventListener('submit', function(event) {
// //       event.preventDefault(); // Prevent default form submission behavior
// //       // Call function to get city coordinates
// //       citycoordinates(category);
// //   });
//   citycoordinates(category);
// }

// // Call the initializeApp function to set up the application
// initializeApp();


// Get the modal elements
var departureModal = document.getElementById("departureModal");
var returnModal = document.getElementById("returnModal");

// Get the button that opens the modal
var calendarIcon = document.getElementById("calendarIcon");

// Get the <span> element that closes the modal
var departureClose = document.getElementsByClassName("close")[0];
var returnClose = document.getElementsByClassName("close")[1];

// When the user clicks on the button, open the modal
calendarIcon.onclick = function() {
  departureModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
departureClose.onclick = function() {
  departureModal.style.display = "none";
}

returnClose.onclick = function() {
  returnModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == departureModal) {
    departureModal.style.display = "none";
  }
  if (event.target == returnModal) {
    returnModal.style.display = "none";
  }
}



// Remove the automatic invocation of initializeApp() at the end of your script
document.getElementById('button').addEventListener('click', function() {
  initializeApp();
});

function initializeApp() {
  citycoordinates(category);
}
