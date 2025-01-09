"use client";

import { useEffect, useState } from "react";
import { RouteResult, searchRoutes } from "./database";

function SearchResult(props: { route: RouteResult }) {
  let { route } = props;
  return (
    <dl>
      <dt>Route Name</dt>
      <dd>
        <a href={`/${route.routeId}`}>{route.routeLongName} ({route.routeShortName})</a>
      </dd>
    </dl>
  );
}

function SearchResults(props: { routes: RouteResult[] }) {
  return props.routes.map((route) => (
    <SearchResult key={route.routeId} route={route} />
  ));
}

export default function Page() {
  let [searchTerm, setSearchTerm] = useState("City");

  let [searchResults, setSearchResults] = useState<RouteResult[]>([]);

  useEffect(() => {
    searchRoutes(searchTerm).then(setSearchResults);
  }, [searchTerm]);
  return (
    <>
      <h1>Hello, Next.js!</h1>
      <input
        value={searchTerm}
        onChange={(evt) => setSearchTerm(evt.target.value)}
      />
      <div> There are {searchResults.length} search results</div>
      <SearchResults routes={searchResults} />
    </>
  );
}
