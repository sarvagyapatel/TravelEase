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
    const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=1&max=50`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return await response.json();
  }

  async function AirportAndCitySearch(accessToken, cityName) {
    return await fetch(`https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=${cityName}&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=analytics.travelers.score&view=FULL`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
}
  
  async function convertDateFormat(inputDate) {
    // Create a Date object from the input date string
    const date = new Date(inputDate);
    
    // Extract year, month, and day from the Date object
    const year = date.getFullYear();
    // Get month value and add 1 because getMonth() returns zero-based month index
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Zero-padding if needed
    const day = date.getDate().toString().padStart(2, '0'); // Zero-padding if needed
    
    // Construct the output date string in YYYY-MM-DD format
    const outputDate = `${year}-${month}-${day}`;
    
    return outputDate;
  }

  // Function to handle search button click
  async function searchFlightOffers(date,originName,destinationName) {

    try {
      const accessToken = await getAccessToken();

      const cityResponse = await AirportAndCitySearch(accessToken, destinationName);
      if (!cityResponse.ok) {
        throw new Error(`Failed to fetch city data: ${cityResponse.statusText}`);
      }
      const cityData = await cityResponse.json();
      const destination=cityData.data[0].address.cityCode;
      console.log(destination);

      const cityResponse2 = await AirportAndCitySearch(accessToken, originName);
      if (!cityResponse2.ok) {
        throw new Error(`Failed to fetch city data: ${cityResponse2.statusText}`);
      }
      const cityData2 = await cityResponse2.json();
      const origin=cityData2.data[0].address.cityCode;;


      let departDate=await convertDateFormat(date);
      return makeRequestWithAccessTokenForFlightSearch(accessToken, origin, destination, departDate);

    } catch (error) {
      console.error('Error:', error);
    }
  }