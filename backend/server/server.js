const express = require("express");
const app = express();
const cors = require('cors')
const loginRoute = require('./routes/userLogin')
const getAllUsersRoute = require('./routes/userGetAllUsers')
const registerRoute = require('./routes/userSignUp')
const getUserByIdRoute = require('./routes/userGetUserById')
const dbConnection = require('./config/db.config')
const editUser = require('./routes/userEditUser')
const deleteUser = require('./routes/userDeleteAll')

//const deleteStationById = require('./routes/stationDeleteStationById')
const getStationById = require('./routes/stationGetStationById')
const stationCreateRoute = require('./routes/stationCreate')
const stationGetAllStations = require('./routes/stationGetAllStations')
const stationUpdateStationById = require('./routes/stationUpdateStationById')

require('dotenv').config();
const SERVER_PORT = 8081

dbConnection()
app.use(cors({origin: '*'}))
app.use(express.json())
app.use('/user', loginRoute)
app.use('/user', registerRoute)
app.use('/user', getAllUsersRoute)
app.use('/user', getUserByIdRoute)
app.use('/user', editUser)
app.use('/user', deleteUser)

//app.use('/station', deleteStationById)
app.use('/station', getStationById)
app.use('/station', stationCreateRoute)
app.use('/station', stationGetAllStations)
app.use('/station', stationUpdateStationById)

app.listen(SERVER_PORT, (req, res) => {
    console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
})
