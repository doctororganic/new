#!/usr/bin/env bash
set -euo pipefail

API_URL=${API_URL:-http://localhost:8080}

echo "[seed] generate 25 items and store"
curl -s "$API_URL/api/v1/generate?count=25&store=true" >/dev/null

echo "[meals] create"
MID=$(curl -s -X POST "$API_URL/api/v1/meals" -H 'Content-Type: application/json' -d '{"name":"Test Meal","calories":123,"protein":10,"carbs":11,"fat":5}' | sed -E 's/.*"id":([0-9]+).*/\1/')
test -n "$MID" && echo "created meal id=$MID"

echo "[meals] detail"
curl -s "$API_URL/api/v1/meals/$MID" | grep -q '"name":"Test Meal"'

echo "[meals] update"
curl -s -X PUT "$API_URL/api/v1/meals/$MID" -H 'Content-Type: application/json' -d '{"name":"Updated Meal","calories":456,"protein":20,"carbs":22,"fat":9}' >/dev/null
curl -s "$API_URL/api/v1/meals/$MID" | grep -q '"name":"Updated Meal"'

echo "[workouts] create/update/detail"
WID=$(curl -s -X POST "$API_URL/api/v1/workouts" -H 'Content-Type: application/json' -d '{"name":"Smoke Cardio","duration":30,"calories_burned":200,"type":"cardio"}' | sed -E 's/.*"id":([0-9]+).*/\1/')
curl -s "$API_URL/api/v1/workouts/$WID" | grep -q '"name":"Smoke Cardio"'
curl -s -X PUT "$API_URL/api/v1/workouts/$WID" -H 'Content-Type: application/json' -d '{"name":"Smoke Cardio+","duration":45,"calories_burned":300,"type":"cardio"}' >/dev/null
curl -s "$API_URL/api/v1/workouts/$WID" | grep -q '"name":"Smoke Cardio+"'

echo "[conditions] create/update/detail with cache invalidation"
CID=$(curl -s -X POST "$API_URL/api/v1/conditions" -H 'Content-Type: application/json' -d '{"name":"SmokeCond","type":"disease"}' | sed -E 's/.*"id":([0-9]+).*/\1/')
curl -s "$API_URL/api/v1/conditions/$CID" | grep -q '"name":"SmokeCond"'
BEFORE=$(curl -s -w '%{time_total}' "$API_URL/api/v1/conditions" -o /dev/null)
curl -s -X PUT "$API_URL/api/v1/conditions/$CID" -H 'Content-Type: application/json' -d '{"name":"SmokeCond+","type":"disease"}' >/dev/null
AFTER_LIST=$(curl -s "$API_URL/api/v1/conditions")
echo "$AFTER_LIST" | grep -q 'SmokeCond+'
AFTER_TIME=$(curl -s -w '%{time_total}' "$API_URL/api/v1/conditions" -o /dev/null)
echo "conditions list time before=$BEFORE after=$AFTER_TIME"

echo "[pagination] validate pages"
curl -s "$API_URL/api/v1/meals?limit=20&offset=0" | grep -q '"meals"'
curl -s "$API_URL/api/v1/meals?limit=20&offset=20" | grep -q '"meals"'

echo "[large] generate ~1000 entries"
for i in {1..10}; do curl -s "$API_URL/api/v1/generate?count=100&store=true" >/dev/null; done
curl -s "$API_URL/api/v1/meals?limit=20&offset=980" | grep -q '"meals"'

echo "[done] smoke tests passed"

