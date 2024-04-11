async function getAccessToken() {
    const apiKey = 'vpZpJHun8Sgh5qHDCoJdbrnBZJsYsqGV';
    const apiSecret = 'ylKl1aNGF9Jh8TdH';
    const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${apiSecret}`
    });

    const data = await response.json();
    return data.access_token;
  }

  // Function to make request with access token
  async function makeRequestWithAccessTokenForFlightSearch(accessToken, origin, destination, departureDate) {
    const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=1&max=250`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return await response.json();
  }

  async function AirportAndCitySearch(accessToken, countryCode, cityName) {
    return await fetch(`https://test.api.amadeus.com/v1/reference-data/locations/cities?countryCode=${countryCode}&keyword=${cityName}&max=10`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
}
 
  // Function to display flight offers
//   function displayFlightOffers(flightOffers) {
//     const flightOffersBody = document.getElementById('flightOffersBody');
//     flightOffersBody.innerHTML = ''; // Clear previous search results

//     flightOffers.data.forEach((offer) => {
//       const itinerary = offer.itineraries[0];
//       const segments = itinerary.segments;
//       const firstSegment = segments[0];
//       const lastSegment = segments[segments.length - 1];

//       const row = document.createElement('tr');
//       row.innerHTML = `
//         <td>${offer.id}</td>
//         <td>${offer.price.total*90}</td>
//         <td>${itinerary.duration}</td>
//         <td>${firstSegment.departure.iataCode} - ${firstSegment.departure.at}</td>
//         <td>${lastSegment.arrival.iataCode} - ${lastSegment.arrival.at}</td>
//       `;
//       flightOffersBody.appendChild(row);
//     });
//   }

  // Function to handle search button click
  async function searchFlightOffers(cityName) {
    // const origin = document.getElementById('origin').value;
    // const destination = document.getElementById('destination').value;
    // const departureDate = document.getElementById('departureDate').value;

    try {
      const accessToken = await getAccessToken();
    //   const cityName = document.getElementById('destination').value;
      const countryCode = 'IN';

      const cityResponse = await AirportAndCitySearch(accessToken, countryCode, cityName);
      if (!cityResponse.ok) {
        throw new Error(`Failed to fetch city data: ${cityResponse.statusText}`);
      }
      const cityData = await cityResponse.json();
      const destination=cityData.data[0].iataCode;
      const origin='DEL';
      const departureDate='2024-05-02';
      return makeRequestWithAccessTokenForFlightSearch(accessToken, origin, destination, departureDate);

    //   displayFlightOffers(flightOffers);

    //   console.log(flightOffers);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Call search function when the page loads
//   window.onload = function() {
//     searchFlightOffers();
//   };
