FROM node:18.17-alpine as build

COPY ./ app
WORKDIR /app
RUN yarn
COPY docker/env.local .env.local
RUN yarn build


# https://github.com/nginxinc/docker-nginx/tree/1.22.1
FROM nginx:1.22.1

RUN apt-get update && apt-get install -y jq

COPY --from=build /app/dist /app/dist
RUN mv docker-entrypoint.sh docker-entrypoint-base.sh
COPY docker/docker-entrypoint.sh .
COPY docker/docker-entrypoint.d/* /docker-entrypoint.d/
COPY docker/default.conf.template /etc/nginx/templates/
