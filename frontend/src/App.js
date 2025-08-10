import React from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes, useLocation } from "react-router-dom";
import './styles/card.css';
import './index.css';

import MbtaAlertsPage from "./pages/mbtaAlerts";
import MbtaLinesPage from "./pages/mbtaLines";
import TripPlannerPage from "./pages/tripPlannerPage";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import LandingPage from "./pages/landingPage";
import HomePage from "./pages/homePage";
import Login from "./pages/loginPage";
import Signup from "./pages/registerPage";
import PrivateUserProfile from "./pages/privateUserProfilePage";
import { createContext, useState, useEffect } from "react";
import getUserInfo from "./utils/decodeJwt";
import MapPage from "./pages/mapPage";
import TripSummaryPage  from "./pages/tripSummaryPage";

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
