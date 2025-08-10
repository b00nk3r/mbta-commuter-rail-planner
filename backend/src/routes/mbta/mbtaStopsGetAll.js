const express = require("express");
const router = express.Router();
const axios = require('axios');

const config = {
    baseUrl: 'https://api-v3.mbta.com',
    apiKey: process.env.MBTA_API_KEY
};

const mbtaApi = {
    getHeaders() {
        return { 'x-api-key': config.apiKey };
    },

    async getTrainRoutes() {
        try {
            const response = await axios.get(`${config.baseUrl}/routes`, {
                params: { 'filter[type]': 2 }, // Type 2 represents Commuter Rail routes
                headers: this.getHeaders()
            });

            const routesData = response.data?.data;

            if (routesData === null || routesData === undefined) {
                throw new Error("The MBTA API response did not provide any route data.");
            }

            if (!Array.isArray(routesData)) {
                throw new Error("The MBTA API did not return a valid array of routes.");
            }

            const routeIds = routesData.map(route => route.id);
            return routeIds;
        } catch (err) {
            console.error(`Error fetching train routes: ${err.message}`);
            return [];
        }
    },

    async getStopsForRoute(routeId) {
        try {
            const response = await axios.get(`${config.baseUrl}/stops`, {
                params: { 'filter[route]': routeId },
                headers: this.getHeaders()
            });

            const stopsData = response.data?.data || [];
            return stopsData;
        } catch (err) {
            console.error(`Error fetching stops for route ${routeId}: ${err.message}`);
            return [];
        }
    }
};

const transformers = {
    extractBasicInfo(stop) {
        return {
            _id: stop.id,
            stationName: stop.attributes.name,
            latitude: stop.attributes.latitude,
            longitude: stop.attributes.longitude
        };
    },

    deduplicate(stops) {
        const uniqueStops = new Map();

        stops.flat().forEach(stop => {
            if (stop != null && !uniqueStops.has(stop.id)) {
                const stopInfo = transformers.extractBasicInfo(stop);
                if (stopInfo != null) {
                    uniqueStops.set(stop.id, stopInfo);
                }
            }
        });

        return Array.from(uniqueStops.values());
    }
};

router.get('/getAll', async (req, res) => {
    try {
        const routeIds = await mbtaApi.getTrainRoutes();
        const stopPromises = routeIds.map(routeId => mbtaApi.getStopsForRoute(routeId));
        const allStops = await Promise.all(stopPromises);

        let stopsInfo = transformers.deduplicate(allStops);

        // Step 1: Define image URLs for specific stations
        const imageMap = {
            'Gloucester': 'https://gloucester-ma.gov/ImageRepository/Document?documentID=6438',
            'West Gloucester': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/MBTAwestg10.jpg/960px-MBTAwestg10.jpg',
            'Rockport': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Rockport_Mass_harbour_and_Motif_1.JPG/500px-Rockport_Mass_harbour_and_Motif_1.JPG',
            'North Station': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/North_Station_from_north_August_2024.jpg/1920px-North_Station_from_north_August_2024.jpg',
            'Manchester': 'https://www.manchester.ma.us/ImageRepository/Document?documentID=7742',
            'Beverly Farms': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Beverly_Farms_Fire_Station.JPG/1280px-Beverly_Farms_Fire_Station.JPG',
            'Montserrat': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Montserrat_%28MBTA_station%29.jpg/1280px-Montserrat_%28MBTA_station%29.jpg',
            'Newburyport': 'https://northofboston.org/wp-content/uploads/2024/02/20220807_SI_Newburyport_0123-1024x600.jpg',
            'Rowley': 'https://northofboston.org/wp-content/uploads/2024/02/20220828_SI_Rowley_125-scaled.jpg',
            'Ipswich': 'https://a.travel-assets.com/findyours-php/viewfinder/images/res70/530000/530740-ipswich.jpg',
            'Hamilton/Wenham': 'https://massbytrain.com/wp-content/uploads/2024/05/Hamilton-JCM06291-1-2000x1125.jpg',
            'North Beverly': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/North_Beverly_station%2C_May_2012.JPG/1280px-North_Beverly_station%2C_May_2012.JPG',
            'Beverly': 'https://northofboston.or.g/wp-content/uploads/2024/02/20220830_SI_BeverlyCabot_003-951x600.jpg',
            'Salem': 'https://townsquare.media/site/701/files/2022/09/attachment-Your-paragraph-text-49.jpg?w=980&q=75',
            'Swampscott': 'https://northofboston.org/wp-content/uploads/2024/02/20220902_SI_Swampscott_022-1024x600.jpg',
            'Lynn': 'https://northofboston.org/wp-content/uploads/2024/02/20220902_SI_Lynn_Downtown_021-scaled.jpg',
            'Wonderland': 'https://bdc2020.o0bc.com/wp-content/uploads/2023/04/IMG_6826-6447ddcb8fb3d-768x432.jpg?width=900',
            'Lynn Interim': 'https://massbytrain.com/wp-content/uploads/2024/05/Lynn_Murals-and-Train-tracks-2000x1125.jpg',
            'River Works': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/River_Works_commuter_rail_stop.jpg/1199px-River_Works_commuter_rail_stop.jpg?20120122213812',
            'Chelsea': 'https://www.mma.org/wp-content/uploads/2023/01/Chelsea_CityHall-2024.jpg',
            'Readville': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/b5/14/f0/historic-dedham-square.jpg?w=900&h=-1&s=1',
            'Fairmount': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Fairmount_station_from_bridge.JPG/1280px-Fairmount_station_from_bridge.JPG',
            'Blue Hill Avenue': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_end_of_Blue_Hill_Avenue_station%2C_July_2019.JPG/1280px-East_end_of_Blue_Hill_Avenue_station%2C_July_2019.JPG',
            'Morton Street':'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Diesel_fumes_from_departing_Fairmount_Line_train_at_Morton_Street.jpg/1280px-Diesel_fumes_from_departing_Fairmount_Line_train_at_Morton_Street.jpg',
            'Talbot Avenue':'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Inbound_train_at_Talbot_Avenue_station%2C_July_2019.JPG/500px-Inbound_train_at_Talbot_Avenue_station%2C_July_2019.JPG',
            'Four Corners/Geneva':'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Platforms_at_Four_Corners_Geneva_station%2C_July_2013.JPG/1280px-Platforms_at_Four_Corners_Geneva_station%2C_July_2013.JPG',
            'Uphams Corner':'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/S_B_Pierce_Building%2C_Uphams_Corner%2C_Dorchester_MA.jpg/1280px-S_B_Pierce_Building%2C_Uphams_Corner%2C_Dorchester_MA.jpg',
            'Newmarket':'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Newmarket_station%2C_looking_inbound%2C_July_2013.JPG/1280px-Newmarket_station%2C_looking_inbound%2C_July_2013.JPG',
            'South Station':'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/South_Station_Tower_construction_from_Dewey_Square%2C_April_2023.jpg/1280px-South_Station_Tower_construction_from_Dewey_Square%2C_April_2023.jpg',
            'New Bedford':'https://upload.wikimedia.org/wikipedia/commons/f/fc/New_Bedford%2C_Massachusetts-view_from_harbor.jpeg',
            'Church Street':'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Inbound_MBTA_New_Bedford_Line_train_2038_at_Church_Street_March_2025.jpg/960px-Inbound_MBTA_New_Bedford_Line_train_2038_at_Church_Street_March_2025.jpg',
            'Fall River Depot':'https://www.brandonjbroderick.com/sites/default/files/styles/hero/public/2024-01/fall-river-ma-personal-injury-lawyer.jpg.webp?itok=9ZEdPleN',
            'Freetown':'https://www.progressiverailroading.com/resources/editorial/2022/121222mbta.jpg',
            'East Taunton':'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Outbound_MBTA_New_Bedford_train_2021_and_Fall_River_train_1971_at_East_Taunton_March_2025_1.jpg/1280px-Outbound_MBTA_New_Bedford_train_2021_and_Fall_River_train_1971_at_East_Taunton_March_2025_1.jpg',
            'Middleborough':'https://seeplymouth.com/wp-content/uploads/2023/03/Middleborough-Krazy-Days-copy.jpg',
            'Bridgewater':'https://upload.wikimedia.org/wikipedia/commons/9/98/East_Bridgewater_Common.jpg',
            'Campello':'https://imagescdn.homes.com/i2/_00g5FAOKq2LL7EsehX35ESHSUtsYjEqJifdqu1msPQ/117/campello-brockton-ma.jpg?p=1',
            'Brockton':'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Brockton%2C_MA%2C_intersection_of_Legion%2C_Centre%2C_and_Main_looking_north.jpg/1024px-Brockton%2C_MA%2C_intersection_of_Legion%2C_Centre%2C_and_Main_looking_north.jpg',
            'Montello':'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Montello_MBTA_station%2C_Brockton_MA.jpg/960px-Montello_MBTA_station%2C_Brockton_MA.jpg',
            'Holbrook/Randolph':'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Outbound_train_at_Holbrook_Randolph_station%2C_June_2017.JPG/1280px-Outbound_train_at_Holbrook_Randolph_station%2C_June_2017.JPG',
            'Braintree':'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Braintree_Town_Hall%2C_MA.jpg/1280px-Braintree_Town_Hall%2C_MA.jpg',
            'Quincy Center':'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Quincycenter.jpg/1280px-Quincycenter.jpg',
            'JFK/UMass':'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Outbound_Braintree_Branch_train_at_JFK_UMass_station%2C_July_2013.JPG/960px-Outbound_Braintree_Branch_train_at_JFK_UMass_station%2C_July_2013.JPG',
            'Wachusett':'https://skiwmrt.com/sites/default/files/2023-07/WMRT-Map.jpg',
            'Fitchburg':'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Downtown_Fitchburg_MA_aerial.JPG/1200px-Downtown_Fitchburg_MA_aerial.JPG',
            'North Leominster':'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Inbound_train_at_North_Leominster_station%2C_December_2013.JPG/1280px-Inbound_train_at_North_Leominster_station%2C_December_2013.JPG',
            'Shirley':'https://freedomsway.org/wp-content/uploads/2021/09/shirley-ma_mulpus-brook-covered-bridge.jpeg',
            'Ayer':'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Main_Street%2C_Ayer_MA.jpg/1280px-Main_Street%2C_Ayer_MA.jpg',
            'Littleton/Route 495':'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Platform_at_Littleton_Route_495_station%2C_July_2019.JPG/1197px-Platform_at_Littleton_Route_495_station%2C_July_2019.JPG',
            'South Acton':'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Footbridge_at_South_Acton_station_%281%29%2C_May_2017.JPG/1280px-Footbridge_at_South_Acton_station_%281%29%2C_May_2017.JPG',
            'West Concord':'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Outbound_train_at_West_Concord_station%2C_May_2017.JPG/1200px-Outbound_train_at_West_Concord_station%2C_May_2017.JPG',
            'Concord':'https://seeplymouth.com/wp-content/uploads/2020/05/Concord-MA-aerial-view-850x850.jpg',
            'Lincoln':'https://cdn10.bostonmagazine.com/wp-content/uploads/sites/2/2025/03/15-Stratford-Way-Lincoln-Massachusetts-Job-25499-0014-printnew.jpg',
            'Silver Hill':'https://upload.wikimedia.org/wikipedia/commons/e/ef/WestonMA_SilverHillHD.jpg',
            'Kendal Green':'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Kendal_Green_station%2C_Weston_MA.jpg/1200px-Kendal_Green_station%2C_Weston_MA.jpg',
            'Brandeis/Roberts':'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Inbound_train_at_Brandeis_Roberts_station_%281%29%2C_July_2019.JPG/1280px-Inbound_train_at_Brandeis_Roberts_station_%281%29%2C_July_2019.JPG',
            'Waltham':'https://thebossmagazine.com/wp-content/uploads/2024/09/henry-dixon-YmKjTLbCbs-unsplash-1.jpg',
            'Waverlry':'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Waverley_MBTA_Station%2C_2022%2C_Belmont_MA.jpg/1200px-Waverley_MBTA_Station%2C_2022%2C_Belmont_MA.jpg',
            'Belmont':'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Looking_north_on_Leonard_Street%2C_Belmont_Center_MA.jpg/1200px-Looking_north_on_Leonard_Street%2C_Belmont_Center_MA.jpg',
            'Porter':'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Porter_Southbound_MBTA_Red_Line_Platform%2C_June_2024.jpg/1200px-Porter_Southbound_MBTA_Red_Line_Platform%2C_June_2024.jpg',
            'Worcester':'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Downtown_Worcester%2C_Massachusetts.jpg/1920px-Downtown_Worcester%2C_Massachusetts.jpg',
            'Grafton':'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Grafton_Mass.jpg/1280px-Grafton_Mass.jpg',
            'Westborough':'https://mediaim.expedia.com/destination/9/9abe424fd7443b597f0536bcd942c8a6.jpg',
            'Southborough':'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Center_of_Southborough_Massachusetts.jpg/1280px-Center_of_Southborough_Massachusetts.jpg',
            'Ashland':'https://massbaymovers.com/wp-content/uploads/2024/08/Ashland-MA-from-above.jpg',
            'Framingham':'https://www.apartmentguide.com/blog/wp-content/uploads/2024/05/Framingham_MA_shutterstock_1236736477-1024x767.jpg',
            'West Natick':'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Outbound_train_leaving_West_Natick_station%2C_May_2017.JPG/1280px-Outbound_train_leaving_West_Natick_station%2C_May_2017.JPG',
            'Natick Center':'https://www.progressiverailroading.com/resources/editorial/2019/PR1119-MBTA-Natick.jpeg',
            'Wellesley Square':'https://wellesleyhistory.wordpress.com/wp-content/uploads/2013/01/wellesleysquare.jpg',
            'Wellesley Hills':'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Wellesley_Hills_station%2C_March_2013.JPG/1280px-Wellesley_Hills_station%2C_March_2013.JPG',
            'Wellesley Farms':'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Outbound_train_at_Wellesley_Farms_2.jpg/1280px-Outbound_train_at_Wellesley_Farms_2.jpg',
            'Auburndale':'https://imagescdn.homes.com/i2/Wi3zetvGBNeH3JPW0fA99ARUkhlJTsA2pCulbQl9EFk/102/auburndale-boston-ma.jpg?p=1',
            'West Newton':'https://upload.wikimedia.org/wikipedia/commons/6/69/NewtonMA_WestNewtonVillageCenter.jpg',
            'Newtonville':'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Inbound_train_arriving_at_Newtonville_November_2023_2.jpg/1280px-Inbound_train_arriving_at_Newtonville_November_2023_2.jpg',
            'Boston Landing':'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,q_75,w_1200/v1/crm/boston/BL1_FAE2461F-0227-62F3-E91AA970C224EF90-fae240b7fd3132d_fae2d9b3-94ed-d8fd-650bde2c0cdeeb81.jpg',
            'Lansdowne':'https://massbytrain.com/wp-content/uploads/2024/05/Night-time_Trains_Fast_Worcester-Line_Lansdowne-Station-2000x1125.jpeg',
            'Back Bay':'https://www.30dalton.com/wp-content/uploads/2016/11/photodune-14276000-back-bay-in-boston-l-1.jpg',
            'Forge Park/495':'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Forge_Park_495_station_platforms_and_building%2C_May_2017.JPG/1280px-Forge_Park_495_station_platforms_and_building%2C_May_2017.JPG',
            'Franklin':'https://imagescdn.homes.com/i2/6w7S6XOsdWlvPtvvMHiSU4lXmlSZK4wrT7N-L9vkk0I/112/franklin-ma-3.jpg?p=1',
            'Norfolk':'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Federated_Church_of_Norfolk%2C_MA.jpg/1280px-Federated_Church_of_Norfolk%2C_MA.jpg',
            'Foxboro':'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Gillette_Stadium_%28Top_View%29.jpg/1280px-Gillette_Stadium_%28Top_View%29.jpg',
            'Walpole':'https://massbytrain.com/wp-content/uploads/2024/05/AdobeStock_693614556-2000x1125.jpeg',
            'Windsor Gardens':'https://en.wikipedia.org/wiki/Windsor_Gardens_station#/media/File:Windsor_Gardens_MBTA_station,_Norwood_MA.jpg',
            'Norwood Central':'https://en.wikipedia.org/wiki/Norwood_Central_station#/media/File:Norwood_Central_MBTA_station,_Norwood_MA.jpg',
            'Norwood Depot':'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Norwood_Depot%2C_Norwood_MA.jpg/1280px-Norwood_Depot%2C_Norwood_MA.jpg',
            'Islington':'https://massbytrain.com/wp-content/uploads/2024/05/AdobeStock_689910737-2000x1125.jpeg',
            'Dedham Corporate Center':'https://1.bp.blogspot.com/-pRvJWhn5A_w/V3CQWUTAVWI/AAAAAAAAP9Y/QOny-6vHjEcp489AzJ5H3xg1J6IX3J08gCLcB/s1600/MBTA%2BDedham%2BCorporate%2BCenter%2BShelter.JPG',
            'Endicott':'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Endicott_MBTA_station%2C_Dedham_MA.jpg/1280px-Endicott_MBTA_station%2C_Dedham_MA.jpg',
            'Forest Hills':'https://upload.wikimedia.org/wikipedia/commons/0/03/Forest_Hills_T_Stop-101.jpg',
            'Ruggles':'https://huntnewsnu.com/wp-content/uploads/2023/11/Ruggles_9_16_23_DarinZullo_2-1200x800.jpg',
            'Hyde Park':'https://media.wbur.org/wp/2023/07/0731_hyde-park01-1920x1281.jpg',
            'Greenbush':'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Greenbush_MBTA_station%2C_Scituate_MA.jpg/1280px-Greenbush_MBTA_station%2C_Scituate_MA.jpg',
            'North Scituate':'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Outbound_train_entering_North_Scituate_MBTA_station%2C_North_Scituate_MA.jpg/1280px-Outbound_train_entering_North_Scituate_MBTA_station%2C_North_Scituate_MA.jpg',
            'Cohasset':'https://seeplymouth.com/wp-content/uploads/2023/03/Cohasset-DSC_0385.jpg',
            'Nantasket Junction':'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Nantasket_Junction.jpg/1280px-Nantasket_Junction.jpg',
            'West Hingham':'https://en.wikipedia.org/wiki/West_Hingham_station#/media/File:West_Hingham_station_platform,_2007.jpg',
            'East Weymouth':'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/East_Weymouth_station_facing_inbound%2C_2007.jpg/1280px-East_Weymouth_station_facing_inbound%2C_2007.jpg',
            'Weymouth Landing/East Braintree':'https://upload.wikimedia.org/wikipedia/commons/b/b6/East_Braintree-Weymouth_Landing.jpg',
            'Bradford':'https://s3.amazonaws.com/eap03.easyagentpro.com/wp-content/uploads/sites/1307/2024/06/06172556/bradford.jpeg',
            'Lawrence':'https://northofboston.org/wp-content/uploads/2024/02/20220825_SI_Lawrence_074-scaled.jpg',
            'Andover':'https://housely.com/wp-content/uploads/2023/08/andover-mass.jpg',
            'Ballardvale':'https://en.wikipedia.org/wiki/Ballardvale,_Massachusetts#/media/File:AndoverMA_BallardvaleMillPond.jpg',
            'North Wilmington':'https://en.wikipedia.org/wiki/North_Wilmington_station#/media/File:Inbound_train_at_North_Wilmington_station,_June_2015.JPG',
            'Reading':'https://cdn.thecrazytourist.com/wp-content/uploads/2022/09/ccimage-shutterstock_1523898065.jpg',
            'Wakefield':'https://www.visitingnewengland.com/PageMill_Resources/Lake-Quannapowitt-Wakefield.jpg',
            'Greenwood':'https://upload.wikimedia.org/wikipedia/commons/7/79/Facing_south_at_Greenwood_station%2C_June_2017.JPG',
            'Melrose Highlands':'https://upload.wikimedia.org/wikipedia/commons/b/bc/MBTA_MP36PH-3C_010_at_Melrose_Highlands_Station.jpg',
            'Melrose/Cedar Park':'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Shelters_at_Melrose_Cedar_Park_station%2C_June_2012.JPG/1280px-Shelters_at_Melrose_Cedar_Park_station%2C_June_2012.JPG',
            'Wyoming Hill':'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Inbound_train_at_Wyoming_Hill%2C_October_2010.jpg/1280px-Inbound_train_at_Wyoming_Hill%2C_October_2010.jpg',
            'Oak Grove':'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Oak_Grove_MBTA_Train_Meet_%281%29%2C_July_2024.jpg/1280px-Oak_Grove_MBTA_Train_Meet_%281%29%2C_July_2024.jpg',
            'Malden Center':'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Malden_Center_MBTA_Orange_Line_Platform%2C_July_2024.jpg/1280px-Malden_Center_MBTA_Orange_Line_Platform%2C_July_2024.jpg',
            'Kingston':'https://metrosouthchamber.com/wp-content/uploads/2021/06/Grays-Beach-Park-Kingston-MA-1.jpg',
            'Halifax':'https://upload.wikimedia.org/wikipedia/commons/b/b2/Halifax_Massachusetts1.jpg',
            'Hanson':'https://massbytrain.com/wp-content/uploads/2024/05/3840x2160_CR-3-2000x1125.jpg',
            'Whitman':'https://upload.wikimedia.org/wikipedia/commons/b/b9/Whitman_Town_Hall.JPG',
            'Abington':'https://imagescdn.homes.com/i2/Nubn_Ghe7A6rQwk3oFBuG6mDLR2bJ1JFKaeSsXXIbPo/112/abington-ma-4.jpg?p=1',
            'South Weymouth':'https://en.wikipedia.org/wiki/South_Weymouth_station#/media/File:South_Weymouth_MBTA_Station,_Weymouth_MA.jpg',
            'Lowell':'https://newenglandexplorer.co/wp-content/uploads/2022/12/lowell-massachusetts-1200-%C3%97-900-px-1024x768.webphttps://newenglandexplorer.co/wp-content/uploads/2022/12/lowell-massachusetts-1200-%C3%97-900-px-1024x768.webp',
            'North Billerica':'https://en.wikipedia.org/wiki/North_Billerica_station#/media/File:North_Billerica_station_building_from_northbound_platform,_May_2016.JPG',
            'Wilmington':'https://bostonraremovers.com/wp-content/uploads/2023/07/shutterstock_1518828836.jpg',
            'Anderson/Woburn':'https://www.greatamericanstations.com/wp-content/uploads/2016/10/Woburn-2021-Glucksman.jpg',
            'West Medford':'https://upload.wikimedia.org/wikipedia/commons/0/0f/Outbound_MBTA_Lowell_Line_train_333_at_West_Medford_March_2025.jpg',
            'Winchester Center':'https://en.wikipedia.org/wiki/Winchester_Center_Historic_District#/media/File:Book_Ends_-_Winchester,_MA_-_DSC04163.JPG',
            'Wedgemere':'https://en.wikipedia.org/wiki/Wedgemere_station#/media/File:Platforms_at_Wedgemere_station,_September_2022.jpg',
            'Needham Heights':'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Needham_Heights_station_from_West_Street%2C_March_2016.JPG/1280px-Needham_Heights_station_from_West_Street%2C_March_2016.JPG',
            'Needham Center':'https://en.wikipedia.org/wiki/Needham_Center_station#/media/File:Needham_Center_MBTA_station,_Needham_MA.jpg',
            'Needham Junction':'https://en.wikipedia.org/wiki/Needham_Junction_station#/media/File:Needham_Junction_station_from_tracks_HDR,_March_2016.jpg',
            'Hersey':'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Hersey_MBTA_station.JPG/1280px-Hersey_MBTA_station.JPG',
            'West Roxbury':'https://en.wikipedia.org/wiki/West_Roxbury#/media/File:Centre_Street,_West_Roxbury.jpg',
            'Highland':'https://en.wikipedia.org/wiki/Highland_station_%28MBTA%29#/media/File:Highland_station_from_Park_Street_bridge,_May_2012.JPG',
            'Bellevue':'https://upload.wikimedia.org/wikipedia/commons/d/d6/Bellevue_Square_Entrance%2C_April_2023.png',
            'Roslindale Village':'https://media.wbur.org/wp/2023/08/0725_roslindale02-1920x1281.jpeg'
        };

        // Step 2: Add imageUrl to each stop (default if not in map)
        stopsInfo = stopsInfo.map(stop => ({
            ...stop,
            imageUrl: imageMap[stop.stationName] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/MBTA.svg/768px-MBTA.svg.png'
        }));

        return res.json(stopsInfo);
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to fetch station data from external source.'
        });
    }
});



module.exports = router;