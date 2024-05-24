#!/bin/bash

VERSION=0.7.3
PLATFORM=linux
CODECOV_BINARY_URL=https://github.com/codecov/uploader/releases/download/v${VERSION}/codecov-${PLATFORM}
OUTPUT_DIR="$(cd $(dirname $0); pwd)/download"
CACHE_FILE="${OUTPUT_DIR}/codecov-${PLATFORM}-${VERSION}"

if [ ! -f "${CACHE_FILE}" ]; then
  echo "Downloading codecov binary"
  curl -L "${CODECOV_BINARY_URL}" -o "${CACHE_FILE}"
  chmod +x "${CACHE_FILE}"
else
  echo "Using cached codecov binary at version ${VERSION}"
fi

echo "Creating a symbolic link to codecov binary"
ln -s --force "${CACHE_FILE}" "${OUTPUT_DIR}/codecov"
