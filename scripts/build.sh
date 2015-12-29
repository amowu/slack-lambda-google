#!/bin/sh -e

if [ ! -f ./config.json ]; then
  echo "Unable to build Lambda.zip, \"config.json\" is required!"
  exit 1
fi

npm install

rm -rf ./dist
mkdir -p dist

zip -r -q dist/lambda.zip . -i "lib/*" "node_modules/*" "config.json" "messages.json" "lambda.js" "package.json" -x "*/.DS_Store"
