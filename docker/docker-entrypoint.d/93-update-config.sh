#!/bin/bash
# Update config.json

source $(dirname -- "$0")/envvar.sh

CONFIG_JSON="config.json"

[ -d "${SITE_DIR}" ] || {
    echo "Error: ${SITE_DIR} doesn't exist!"
    exit 1
}

[ -f "${SITE_DIR}/${CONFIG_JSON}" ] || {
    echo "Error: ${SITE_DIR}/${CONFIG_JSON} doesn't exist!"
    exit 1
}

(
    set -x
    cd $SITE_DIR
    echo $(jq --arg graphql_http "${GRAPHQL_HTTP}" '.graphqlHttp = ($graphql_http)' ${CONFIG_JSON}) >${CONFIG_JSON}
)
