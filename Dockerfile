FROM node:current-alpine

RUN apk add chromium git && \
	PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
	npm install --global --only=production https://github.com/mcshaman/scrape-alert && \
	apk del git

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /home/node/app

ENTRYPOINT []

CMD ["scrape-alert"]