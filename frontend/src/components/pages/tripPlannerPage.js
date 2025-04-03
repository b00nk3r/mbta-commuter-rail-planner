const backgroundImage = require('../../images/mbta_map.png');

const TripPlannerPage = () => {
  return (
      <div
          style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              textAlign: 'center'
          }}
      >
          <div className="content">
              <h1 className="text-4xl font-bold">Welcome to the Trip Planner</h1>
              <p className="text-2xl">Let's explore some exciting destinations!</p>
          </div>
      </div>
  );
};


export default TripPlannerPage;
