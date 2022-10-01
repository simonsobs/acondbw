#!/bin/bash
# Source docker-entrypoint.sh from Nginx image after setting environment
# variables with default values if not set

export PUBLIC_PATH="${PUBLIC_PATH:-/}"
export GRAPHQL_HTTP="${GRAPHQL_HTTP:-http://localhost:8000}"

echo + "PUBLIC_PATH=${PUBLIC_PATH}"
echo + "GRAPHQL_HTTP=${GRAPHQL_HTTP}"

source /docker-entrypoint.sh
