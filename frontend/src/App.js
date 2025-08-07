import React from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes, useLocation } from "react-router-dom";
import './css/card.css';
import './index.css';

import MbtaAlertsPage from "./components/pages/mbtaAlerts";
import MbtaLinesPage from "./components/pages/mbtaLines";
import TripPlannerPage from "./components/pages/tripPlanner/tripPlannerPage";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import LandingPage from "./components/pages/landingPage";
import HomePage from "./components/pages/homePage";
import Login from "./components/pages/loginPage";
import Signup from "./components/pages/registerPage";
import PrivateUserProfile from "./components/pages/privateUserProfilePage";
import { createContext, useState, useEffect } from "react";
import getUserInfo from "./utilities/decodeJwt";
import MapPage from "./components/pages/mapPage";
import TripSummaryPage  from "./components/pages/tripSummaryPage";

export const UserContext = createContext();
//test change
//test again
const App = () => {
  const [user, setUser] = useState();
  const [departures, setDepartures] = useState([]);
  const location = useLocation();

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  // Hide navbar on landing page
  const shouldShowNavbar = location.pathname !== '/';

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <UserContext.Provider value={user}>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/home" element={<HomePage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route path="/privateUserProfile" element={<PrivateUserProfile />} />
          <Route exact path = "/mbtaAlerts" element ={<MbtaAlertsPage />} />
          <Route exact path = "/mbtaLines" element ={<MbtaLinesPage />} />
          <Route exact path = "/tripPlannerPage" element ={<TripPlannerPage setDepartures={setDepartures}/>} />
          <Route exact path = "/mapPage" element ={<MapPage/>} />
          <Route exact path = "/tripSummaryPage" element ={<TripSummaryPage departures={departures}/>} />




        </Routes>
      </UserContext.Provider>
    </>
  );
};



export default App
