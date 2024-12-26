#!/usr/bin/env sh
echo "Building DB..."
sqlite3 -init build-db.sql data.db </dev/null
echo "Done."
