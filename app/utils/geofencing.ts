
export const BUILDING_LOCATIONS: Record<string, { latitude: number; longitude: number; name: string }> = {
  EV: { latitude: 45.49548608640669, longitude: -73.57806007167528, name: "Engineering & Visual Arts" },
  H:  { latitude: 45.49721390474658, longitude: -73.57906858227709, name: "Hall Building" },
  JMSB: { latitude: 45.49515518152054, longitude: -73.57885668774541, name: "John Molson School of Business" },
  LB: { latitude: 45.49677584482701, longitude: -73.57789645692377, name: "Webster Library" },
};

// Returns distance in metres between two coordinates
export function getDistanceMetres(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// How close (in metres) before notification fires
export const GEOFENCE_RADIUS = 150;