#!/usr/bin/env bash

IMAGE_NAME="currency-bot"
VOLUME_NAME="currency-bot-volume"

CONTAINER_ID=$(docker ps --quiet --filter ancestor=${IMAGE_NAME}:latest)
if [[ ${CONTAINER_ID} ]]; then
  echo "Stopping container '${CONTAINER_ID}'"
  docker stop "${CONTAINER_ID}"
fi

IMAGE_IDS=$(docker images ${IMAGE_NAME} -q)
for IMAGE_ID in ${IMAGE_IDS}; do
  CONTAINER_IDS=$(docker ps -aq -f status=exited -f status=dead -f ancestor="${IMAGE_ID}")

  if [[ ${CONTAINER_IDS} ]]; then
    echo "Removing '${CONTAINER_IDS}' containers"
    docker rm -f "${CONTAINER_IDS}"
  fi

  echo "Removing image ${IMAGE_ID}"
  docker rmi -f "${IMAGE_ID}"
done

echo "Removing volume ${VOLUME_NAME}"
docker volume rm ${VOLUME_NAME}
