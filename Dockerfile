FROM node:current-alpine

WORKDIR /home/node/app

RUN chown node:node .

COPY --chown=node:node ./index.js package.json config-test.js ./

RUN npm i --quiet --only=production \
	&& rm ./package.json

ENTRYPOINT ["node", "./index.js"]