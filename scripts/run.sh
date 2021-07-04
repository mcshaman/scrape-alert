#!/bin/bash

CONFIG_PATH=${CONFIG_PATH:-"$(pwd)/config.js"}

docker run \
	--rm \
	-ti \
	--mount type=bind,source="$CONFIG_PATH",target=/home/node/app/config.js \
	scrape-alert \
	./config.js