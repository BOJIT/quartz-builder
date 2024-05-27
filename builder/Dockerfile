FROM node:20-slim as builder
WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json* .
RUN apt-get update -y && apt-get install -y jq
RUN cat package.json | jq '.scripts."quartz-builder" = "./builder/builder-cli.mjs" | \
    .bin."quartz-builder" = "./builder/builder-cli.mjs"' > tmp.json
RUN cp tmp.json package.json && rm tmp.json
RUN npm ci

FROM node:20-slim
WORKDIR /usr/src/app
COPY . .
COPY --from=builder /usr/src/app/ /usr/src/app/
RUN echo "update-notifier=false" >> .npmrc
RUN mkdir /in /out
RUN rm -rf content && ln -s /in content
ENTRYPOINT ["npx", "quartz-builder"]
