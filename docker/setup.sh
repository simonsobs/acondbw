#!/bin/bash

DIST_DIR="/app/dist"
HTML_DIR="/app/site"
CONFIG_JSON="config.json"

PUBLIC_PATH_PLACEHOLDER="/public_path_placeholder/"

if [[ -z ${PUBLIC_PATH} ]]; then
    echo 'Error: ${PUBLIC_PATH} is not set!'
    exit 1
fi

if [[ -z ${GRAPHQL_HTTP} ]]; then
    echo 'Error: ${GRAPHQL_HTTP} is not set!'
    exit 1
fi

if [[ ! -d ${DIST_DIR} ]]; then
    echo "Error: ${DIST_DIR} doesn't exit!"
    exit 1
fi

if [[ ! -f ${DIST_DIR}/${CONFIG_JSON} ]]; then
    echo "Error: ${DIST_DIR}/${CONFIG_JSON} doesn't exit!"
    exit 1
fi

# Move the Vue files to the Vue publicPath
command="rm -rf $HTML_DIR"
echo + $command
eval $command
HTML_DIR=$(echo $HTML_DIR/$PUBLIC_PATH | tr -s /)
HTML_DIR=${HTML_DIR%/} # e.g., /app/site/vue
command="mkdir -p $(dirname $HTML_DIR)"
echo + $command
eval $command
command="cp -a $DIST_DIR $HTML_DIR"
echo + $command
eval $command

# Update config.json
(
    command="cd ${HTML_DIR}"
    echo + $command
    $command
    command="echo \$(jq --arg graphql_http \"\${GRAPHQL_HTTP}\" '.graphqlHttp = (\$graphql_http)' \${CONFIG_JSON}) > \${CONFIG_JSON}"
    echo + $command
    eval $command
)

# Replace place holders with env vars in Vue files
(
    command="cd $HTML_DIR"
    echo + $command
    $command
    for f in $(find . -type f); do
        command="sed -i -e \"s#$PUBLIC_PATH_PLACEHOLDER#$PUBLIC_PATH#g\" $f"
        echo + $command
        eval $command
    done
)
