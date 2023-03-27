FROM node:16-alpine as builder

COPY ./dist /home/node/app
WORKDIR /home/node/app
ENV NODE_ENV=production

RUN apk add --update --no-cache git

VOLUME [ "/home/node/static" ]

RUN yarn config set sharp_binary_host "https://npmmirror.com/mirrors/sharp"
RUN yarn config set sharp_libvips_binary_host "https://npmmirror.com/mirrors/sharp-libvips"
RUN yarn install --production --registry=https://registry.npm.taobao.org

FROM node:16-alpine

COPY --from=builder /home/node/app /home/node/app
WORKDIR /home/node/app
ENV NODE_ENV=production
VOLUME [ "/home/node/static" ]

USER node
CMD ["node", "server.js"]