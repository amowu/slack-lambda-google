#!/bin/sh -e

[[ -z "$1" ]] && echo "Lambda function name must be provided, example: npm run deploy myLambdaFunction" && exit 1;

echo "build..."

./scripts/build.sh

echo "deploy..."

aws lambda update-function-code \
  --function-name "$1" \
  --zip-file fileb://$(pwd)/dist/lambda.zip
