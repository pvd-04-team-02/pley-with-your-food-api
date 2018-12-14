#!/bin/bash

API="http://localhost:4741"
URL_PATH="/ratings"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "rating": {
      "rate":"'"${RATE}"'",
      "address":"'"${ADDRESS}"'",
      "user":"'"${USER}"'",
      "restaurant":"'"${RESTAURANT}"'"
    }
  }'

echo
