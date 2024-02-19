const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
require('dotenv').config();

const apiUrl = 'https://api.os.uk/search/names/v1/find';
const apiKey = `${process.env.OS_API_KEY}`;
const postcodeRegex = /^[A-Za-z]{1,2}[0-9Rr][0-9A-Za-z]? [0-9][ABD-HJLNP-UW-Zabd-hjlnp-uw-z]{2}$/;


router.post('/addresses', async (req, res) => {
  const searchQuery = req.body.postcode;

    // Validate the postcode using the regular expression
    if (!postcodeRegex.test(searchQuery)) {
      return res.status(400).send('Invalid UK postcode');
    }

  const queryParams = new URLSearchParams({
    query: searchQuery,
    key: apiKey,
    format: 'JSON', // or 'XML' if you prefer XML format
    maxresults: 100, // Adjust as needed
    // Add other optional parameters here (offset, bounds, fq) if required
  });
  try {
    // Make a request to the Ordnance Survey Names API
    response = await fetch(`${apiUrl}?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Key': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Render the addresses template with the API response
    res.render('../views/addresses.njk', { addresses: data.results });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    console.error('API response:', response ? await response.text() : 'Not available');
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;