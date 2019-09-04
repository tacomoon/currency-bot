#!/usr/bin/env bash

VERSION="$(date +'%s')"
CONTEXT="$(dirname "$0")/../"

IMAGE_NAME="currency-bot"
VOLUME_NAME="currency-bot-volume"

if [[ -z $(docker volume ls -f name=${VOLUME_NAME}) ]]; then
  echo "Creating volume '${VOLUME_NAME}'"
  docker volume create $VOLUME_NAME
fi

CONTAINER_ID=$(docker ps --quiet --filter ancestor=${IMAGE_NAME}:latest)
if [[ ${CONTAINER_ID} ]]; then
  echo "Stopping container '${CONTAINER_ID}'"
  docker stop "${CONTAINER_ID}"
fi

echo "Building '${IMAGE_NAME}' image"
docker build \
  --tag "${IMAGE_NAME}:${VERSION}" \
  --tag "${IMAGE_NAME}:latest" \
  --file "${CONTEXT}/Dockerfile" "${CONTEXT}"

echo "Running '${IMAGE_NAME}:latest'"
docker run \
  --publish 3000:3000 \
  --volume ${VOLUME_NAME}:/node/.cache \
  --volume "$(pwd)/node_modules:/node/node_modules" \
  --env "EXCHANGE_CLIENT_TOKEN=${EXCHANGE_CLIENT_TOKEN}" \
  --env "TELEGRAM_CLIENT_TOKEN=${TELEGRAM_CLIENT_TOKEN}" \
  "${IMAGE_NAME}:latest"
