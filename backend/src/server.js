const app = require('./app');
const dbConnection = require('./config/database');

require('dotenv').config();
const SERVER_PORT = 8081;

dbConnection();

app.listen(SERVER_PORT, () => {
    console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
});