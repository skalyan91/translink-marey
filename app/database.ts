"use server";
import sqlite3 from "sqlite3";
sqlite3.verbose();
const db = new sqlite3.Database("SEQ_GTFS/data.db");
db.on("trace", (query) => {
  console.log(`RAN SQL QUERY: ${query}`);
});

export async function getOneRow(query): Promise<object> {
  return new Promise((resolve, reject) => {
    db.get(query, function (err, row) {
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
  const result = await getOneRow("SELECT COUNT(*) as count from routes");
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