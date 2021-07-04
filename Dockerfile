FROM node:current-alpine

WORKDIR /home/node/app

RUN apk add chromium

RUN chown node:node .

COPY --chown=node:node ./index.js ./send-report.js ./package.json ./config-test.js ./
COPY --chown=node:node ./lib ./lib

RUN PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
	npm i --only=production

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

ENTRYPOINT ["node", "./index.js"]
