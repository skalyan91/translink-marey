import { getRouteInfo, getTripStopsForATrip } from "app/database";

export default async function RoutePage({ params }: { params: Promise<{ route: string }> }) {
    const { route } = await params;
    const routeInfo = await getRouteInfo(route);

    
    if (!routeInfo) {
        return <h1>Route not found</h1>;
    }
    
    const tripStops = await getTripStopsForATrip(route);
    
    return <div>
        <h1>Timetable for {routeInfo.routeLongName}</h1>
        <ul>
            {tripStops.map((stop) => <li key={ stop.tripId + stop.arrivalTime}>{stop.tripId}: {stop.arrivalTime} - {stop.stopName}</li>)}
        </ul>
    </div>
}