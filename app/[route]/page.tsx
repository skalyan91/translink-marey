import { getRouteInfo } from "app/database";

export default async function RoutePage({ params }: { params: Promise<{ route: string }> }) {
    const { route } = await params;
    const routeInfo = await getRouteInfo(route);
    
    if (!routeInfo) {
        return <h1>Route not found</h1>;
    }
    
    return <h1>Timetable for {routeInfo.routeLongName}</h1>;
}
