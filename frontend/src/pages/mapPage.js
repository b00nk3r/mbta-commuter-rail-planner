const backgroundImage = require('../assets/images/mbta_map.png');
 
 const MapPage = () => {
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
           
       </div>
   );
 };
 
 
 export default MapPage;