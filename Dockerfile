
##__________________________________________________________________||
FROM node:14.17-alpine as build

WORKDIR /app

COPY ./ acondbw

WORKDIR /app/acondbw

RUN npm install

COPY docker/env.local .env.local

RUN npm run build

##__________________________________________________________________||
FROM nginx:1.19
COPY --from=build /app/acondbw/dist /usr/share/nginx/html
COPY docker/etc-nginx-conf.d-default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
COPY docker/cmd.sh /
RUN chmod +x /cmd.sh
CMD [ "/cmd.sh" ]

##__________________________________________________________________||
