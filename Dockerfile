FROM node:18.20-alpine

RUN apk update && \
	apk add chromium=125.0.6422.112-r0

WORKDIR /root

ARG PACK_FILE

RUN test -n "$PACK_FILE"

COPY "./$PACK_FILE" .

RUN PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
	npm install --global --only=production $PACK_FILE && \
	rm -rf $PACK_FILE

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /home/node/app

ENTRYPOINT []

CMD ["scrape-alert"]