const dotenv = require('dotenv');
dotenv.config();

const baseUrl = process.env.MBTA_BASE_URL;
const apiKey = process.env.MBTA_API_KEY;

function getHeaders() {
  const headers = {};
  if (apiKey) headers['x-api-key'] = apiKey;
  return headers;
}

module.exports = {
  baseUrl,
  apiKey,
  getHeaders
};