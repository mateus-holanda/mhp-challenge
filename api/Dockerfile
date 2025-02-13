# Stage 1: Base image
FROM node:20.12.1-alpine as md-api-build-stage

RUN apk --update --no-cache add python3 make g++

WORKDIR /app

COPY yarn.lock .
COPY package.json .
COPY .yarnrc.build.yml ./.yarnrc.yml
COPY api ./api

# install corepack
RUN corepack enable
RUN corepack install

# remove postinstall script
RUN sed -i 's/postinstall/_postinstall/g' package.json

# build api
RUN yarn install --network-timeout 100000
RUN yarn workspace @mhp/api build
RUN yarn workspaces focus --all --production

# Stage 2: Production image
FROM node:20.12.1-alpine

WORKDIR /app

ARG API_VERSION

ENV NODE_ENV=production
ENV NO_COLOR=true
ENV CHECKPOINT_DISABLE=1
ENV API_VERSION=${API_VERSION}

COPY --from=0 /app/node_modules /app/node_modules
COPY --from=0 /app/api/package.json /app/package.json
COPY --from=0 /app/api/dist /app/dist
COPY --from=0 /app/api/config /app/config
COPY api/run.sh /app/run.sh

EXPOSE 3000

ENTRYPOINT ["/app/run.sh"]
