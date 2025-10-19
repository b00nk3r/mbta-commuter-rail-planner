const express = require("express");
const cors = require('cors');

const loginRoute = require('./routes/users/userLogin');
const getAllUsersRoute = require('./routes/users/userGetAllUsers');
const registerRoute = require('./routes/users/userSignUp');
const getUserByIdRoute = require('./routes/users/userGetUserById');
const editUser = require('./routes/users/userEditUser');
const deleteUser = require('./routes/users/userDeleteAll');

const deleteStationById = require('./routes/stations/stationDeleteStationById');
const getStationById = require('./routes/stations/stationGetStationById');
const stationCreateRoute = require('./routes/stations/stationCreate');
const stationGetAllStations = require('./routes/stations/stationGetAllStations');
const stationUpdateStationById = require('./routes/stations/stationUpdateStationById');
const stationDeleteAllStations = require('./routes/stations/stationDeleteAllStations');

const mbtaStopsGetAll = require('./routes/mbta/mbtaStopsGetAll');
const mbtaLinesGetAll = require('./routes/mbta/mbtaLinesGetAll');
const mbtaShapesGetAll = require('./routes/mbta/mbtaShapesGetAll');
const mbtaDeparturesGetAll = require('./routes/mbta/mbtaDeparturesGetAll');

const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors({origin: '*'}));
app.use(express.json());

// simple health route for Supertest
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/user', loginRoute);
app.use('/user', registerRoute);
app.use('/user', getAllUsersRoute);
app.use('/user', getUserByIdRoute);
app.use('/user', editUser);
app.use('/user', deleteUser);

app.use('/station', deleteStationById);
app.use('/station', getStationById);
app.use('/station', stationCreateRoute);
app.use('/station', stationGetAllStations);
app.use('/station', stationUpdateStationById);
app.use('/station', stationDeleteAllStations);

app.use('/mbtaStops', mbtaStopsGetAll);
app.use('/mbtaLines', mbtaLinesGetAll);
app.use('/mbtaShapes', mbtaShapesGetAll);
app.use('/mbtaDepartures', mbtaDeparturesGetAll);

app.use(errorHandler);

module.exports = app;