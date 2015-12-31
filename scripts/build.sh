#!/bin/sh -e

if [ ! -f ./config.json ]; then
  echo "Unable to build Lambda.zip, \"config.json\" is required!"
  exit 1
fi

echo "install..."

npm install

echo "clean..."

rm -rf ./dist
mkdir -p dist

echo "bundle..."

./node_modules/.bin/webpack

echo "zip..."

zip -r dist/index.zip . -i "dist/index.js"
