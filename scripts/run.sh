#!/bin/bash

CONFIG_PATH=${CONFIG_PATH:-"$(pwd)/config.mjs"}

docker run \
	--rm \
	-ti \
	--mount type=bind,source="$CONFIG_PATH",target=/home/node/app/config.mjs \
	scrape-alert \
	scrape-alert \
	./config.mjs