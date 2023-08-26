FROM node:8.14.1-alpine as build-env

RUN apk --update add git openssh && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*

WORKDIR /work

# restore package in a separate layer
COPY package.json yarn.lock ./
RUN yarn

# copy everything else and build
COPY . ./
RUN npm run build

FROM nginx:stable
EXPOSE 80
COPY --from=build-env /work/build/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

ARG COMMIT

LABEL name=blockchain-terminal-ui
LABEL commit=${COMMIT}

RUN mkdir /config && \
    touch /config/config.js && \
    ln -sf /config/config.js /usr/share/nginx/html/config.js 

RUN echo ${COMMIT} > /usr/share/nginx/html/commit.txt && \
    echo $(date) >> /usr/share/nginx/html/commit.txt

ENV LISTEN_PORT 80

CMD /bin/bash -c "envsubst '\$LISTEN_PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'
