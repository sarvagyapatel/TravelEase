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


  
// Function to fetch the selected dates
function fetchSelectedDates() {
  // Get the values of the "Depart" and "Return" inputs
  const departDate = document.getElementById('result_from').value;
  const returnDate = document.getElementById('result_to').value;

  // Get the selected dates from the date pickers
  const departDatePicker = document.getElementById('inline_cal_from');
  const returnDatePicker = document.getElementById('inline_cal_to');

  const departSelectedDate = departDatePicker.getAttribute('data-rome-value');
  const returnSelectedDate = returnDatePicker.getAttribute('data-rome-value');
  
  // Log the fetched values
  console.log(departDate);
  // console.log('Return Date:', returnDate, 'Selected:', returnSelectedDate);
  return departDate;
  // You can further process or use the fetched values as needed
}



async function citycoordinates(departDate,catagory) {
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

      const flightdata=await searchFlightOffers(departDate,cityName);
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



// Remove the automatic invocation of initializeApp() at the end of your script
document.getElementById('button').addEventListener('click', function() {
  initializeApp();
});

function initializeApp() {
  const departDate = fetchSelectedDates();
  const enterDate = document.querySelector('.enter_date');
  const enterTag = document.querySelector('.enter_tag');
  
  // Reset text content and hide elements
  enterDate.innerText = '';
  enterDate.style.visibility = "hidden";
  enterTag.innerText = '';
  enterTag.style.visibility = "hidden";
  
  if (category !== '') {
    if (departDate !== '') {
      citycoordinates(departDate, category);
    } else {
      // Show enter date message
      enterDate.innerText = 'Enter Date!!';
      enterDate.style.visibility = "visible";
      
      // Hide enter date message after 100 milliseconds
      setTimeout(() => {
        enterDate.style.visibility = "hidden";
      }, 700);
    }
  } else if (category === '' && departDate === '') {
    // Show enter date message
    enterDate.innerText = 'Enter Date!!';
    enterDate.style.visibility = "visible";
    
    // Show select category message
    enterTag.innerText = 'Select at least one category!!';
    enterTag.style.visibility = "visible";
    
    // Hide both messages after 100 milliseconds
    setTimeout(() => {
      enterDate.style.visibility = "hidden";
      enterTag.style.visibility = "hidden";
    }, 700);
  } else {
    // Show select category message
    enterTag.innerText = 'Select at least one category!!';
    enterTag.style.visibility = "visible";
    
    // Hide select category message after 100 milliseconds
    setTimeout(() => {
      enterTag.style.visibility = "hidden";
    }, 700);
  }
}
