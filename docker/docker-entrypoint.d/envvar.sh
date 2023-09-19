#!/bin/echo to be sourced
# This file is source by other files in this directory. 

GRAPHQL_HTTP="${GRAPHQL_HTTP:-http://localhost:8000}"
echo + "GRAPHQL_HTTP=${GRAPHQL_HTTP}"

DIST_DIR="/app/dist"
SITE_DIR_ROOT="/app/site"

SITE_DIR=$(echo $SITE_DIR_ROOT/$PUBLIC_PATH | tr -s /)
SITE_DIR=${SITE_DIR%/} # e.g., /app/site/vue

PUBLIC_PATH_PLACEHOLDER="/public_path_placeholder/"
