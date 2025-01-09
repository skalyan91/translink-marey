"use server";
import sqlite3 from "sqlite3";
sqlite3.verbose();
const db = new sqlite3.Database("SEQ_GTFS/data.db");

export async function getOneRow(query, params): Promise<object> {
  return new Promise((resolve, reject) => {
    db.get(query, params, function (err, row) {
      if (err != undefined) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

export async function getManyRows(query, params): Promise<object> {
  return new Promise((resolve, reject) => {
    db.all(query, params, function (err, row) {
      if (err != undefined) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}
export async function getStopCount(): Promise<number> {
  const result = await getOneRow("SELECT COUNT(*) as count from routes", []);
  return (result as any).count as number;
}

export interface RouteResult {
  routeId: number;
  routeShortName: string;
  routeLongName: string;
}

export async function searchRoutes(
  searchString: string,
): Promise<RouteResult[]> {
  const result = await getManyRows(
    `

SELECT
route_id AS routeId,
route_short_name AS routeShortName,
route_long_name AS routeLongName
FROM routes
WHERE route_long_name LIKE '%' || ? || '%'
OR route_short_name LIKE '%' || ? || '%'
LIMIT 10
`,
    [searchString, searchString],
  );

  return result as RouteResult[];
}

export async function getRouteInfo(routeId: string): Promise<RouteResult> {
  /**
   * Return information about a specific route (keyed by routeId)
   **/
  const result = await getOneRow(
    `

SELECT
route_id AS routeId,
route_short_name AS routeShortName,
route_long_name AS routeLongName
FROM routes
WHERE route_id = ?
`,
    [routeId],
  );

  return result as RouteResult;
}

interface TripStop {
  arrivalTime: string;
  stopName: string;
}

export async function getTripStopsForATrip(
  routeId: string,
): Promise<TripStop[]> {
  const result = await getManyRows(
    `
SELECT
	arrival_time as arrivalTime,
	stops.stop_name as stopName
 from stop_times
JOIN stops
on stops.stop_id = stop_times.stop_id
where trip_id IN (
  SELECT trip_id
  FROM trips
  where route_id = ?
  limit 1
)
ORDER BY stop_sequence;
SELECT * from stop_times
where trip_id IN (
  SELECT trip_id
  FROM trips
  where route_id IN (SELECT route_id
    FROM routes
    WHERE route_short_name = 444)
  limit 1
) ORDER BY stop_sequence;
`,
    [routeId],
  );
  return result as TripStop[];
}
