## Building the SQLite database

With `SEQ_GTFS` as your working directory, run `./build-db.sh`, after which `data.db` should have all of your data.

## Schema

Stops are stops in the real world

Routes are paths that conceptually go along stops and have a name.

Trips are where we actually go. They are associated to a route (so trips along the same route will likely go to the same places), but only occur (at most!) once in the real world.

A trip has a shape, the shape is a sequence of points found in `shape`

## Queries

- The time table for the first trip for the 444 route ("first" being arbitrarily what we got from the subquery)

``` sql

select stop_times.arrival_time,stops.stop_name
from stop_times 
join stops on stop_times.stop_id = stops.stop_id

where trip_id in 
  (select trip_id from trips join routes on (trips.route_id = routes.route_id and routes.route_short_name = '444') limit 1) 
```

