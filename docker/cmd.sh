#!/bin/bash

##__________________________________________________________________||
DEFAULT_API_URL="http://localhost:5000/graphql"
HTML_DIR="/usr/share/nginx/html"
PLACEHOLDER="graphql_api_url_placeholder_to_be_replaced"

##__________________________________________________________________||
if [ -z $VITE_GRAPHQL_HTTP ]
then
    echo 'Warning: $VITE_GRAPHQL_HTTP is not set!'
    command="VITE_GRAPHQL_HTTP=$DEFAULT_API_URL"
    echo + $command
    eval $command
fi

if [ ! -d $HTML_DIR ]
then
    echo "Error: $HTML_DIR doesn't exit!"
    exit 1
fi

##__________________________________________________________________||
(
    command="cd $HTML_DIR"
    echo + $command
    $command
    for f in assets/*;
    do
        if [ -f $f ]; then
            command="sed -i \"s#$PLACEHOLDER#$VITE_GRAPHQL_HTTP#g\" $f";
            echo + $command;
            eval $command;
        fi
    done
)

##__________________________________________________________________||
command='nginx -g "daemon off;"'
echo + $command;
eval $command;

##__________________________________________________________________||
