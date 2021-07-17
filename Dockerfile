FROM node:current-alpine

RUN apk add chromium

RUN apk add git

WORKDIR /root

RUN PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN npm install --global --only=production https://github.com/mcshaman/scrape-alert

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /home/node

ENTRYPOINT ["scrape-alert"]
