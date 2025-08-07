// Shared constants & helper functions for the Trip-Planner feature

export const TERMINALS = {
    north: ["CR-Fitchburg", "CR-Lowell", "CR-Haverhill", "CR-Newburyport"],
    sstat: [
      "CR-Fairmount",
      "CR-Worcester",
      "CR-Franklin",
      "CR-Providence",
      "CR-Kingston",
      "CR-Needham",
      "CR-Greenbush",
      "CR-NewBedford",
      "CR-Foxboro",
    ],
  };
  
  export const LINE_TO_PREFIX_MAP = {
    "CR-Fairmount": ["DB"],
    "CR-NewBedford": ["NBM", "FRS", "MM", "brntn", "qnctr", "jfk"],
    "CR-Fitchburg": ["FR", "portr", "north"],
    "CR-Worcester": ["WML", "bbsta"],
    "CR-Franklin": ["FB", "forhl", "rugg"],
    "CR-Foxboro": ["FS"],
    "CR-Greenbush": ["GRB"],
    "CR-Haverhill": ["WR", "ogmnl", "mlmnl"],
    "CR-Kingston": ["KB", "PB", "brntn", "qnctr", "jfk"],
    "CR-Lowell": ["NHRML"],
    "CR-Needham": ["NB", "forhl", "rugg"],
    "CR-Newburyport": ["GB", "ER", "wondl", "chels"],
    "CR-Providence": ["NEC", "bbsta"],
    "Common-Stations": ["sstat", "north"],
  };
  
  export const getStationPrefix = (stationId = "") => {
    if (!stationId.includes("-")) return stationId;
    return stationId.split("-")[1] ?? "";
  };
  
  export const decodePolyline = (encoded = "") => {
    const points = [];
    let index = 0,
      lat = 0,
      lng = 0;
  
    while (index < encoded.length) {
      let result = 0,
        shift = 0,
        b;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      lat += result & 1 ? ~(result >> 1) : result >> 1;
  
      result = shift = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      lng += result & 1 ? ~(result >> 1) : result >> 1;
  
      points.push([lat / 1e5, lng / 1e5]);
    }
    return points;
  };