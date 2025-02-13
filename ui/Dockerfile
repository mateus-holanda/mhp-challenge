# Stage 1: Base image
FROM node:20.12.1-alpine as md-ui-build-stage

WORKDIR /app

ARG DEBUG=flag

COPY yarn.lock .
COPY package.json .
COPY .yarnrc.build.yml ./.yarnrc.yml
COPY api ./api
COPY ui ./ui

# install corepack
RUN corepack enable
RUN corepack install

# remove postinstall script
RUN sed -i 's/postinstall/_postinstall/g' package.json

# build api
RUN yarn install --network-timeout 100000
RUN yarn workspace @mhp/ui build
RUN yarn workspaces focus --all --production

# Stage 2: Production image
FROM node:20.12.1-alpine

WORKDIR /app

ARG UI_VERSION

ENV NODE_ENV=production
ENV API_BASE_URL=http://localhost:3000
ENV PORT=80
ENV PUBLIC_URL=""
ENV UI_VERSION=${UI_VERSION}

COPY --from=0 /app/node_modules /app/node_modules
COPY --from=0 /app/ui/package.json /app/package.json
COPY --from=0 /app/ui/build /app/build
COPY --from=0 /app/ui/public /app/public

EXPOSE 4200

ENV PORT=4200

CMD ["yarn", "start"]