#!/bin/sh -e

[[ -z "$1" ]] && echo "Lambda function name must be provided, example: npm run create myLambdaFunction \"arn:aws:iam::YOUR_AWS_ACCOUNT_ID:role/lambda_basic_execution\"" && exit 1;
[[ -z "$2" ]] && echo "IAM Role ARN must be provided, example: npm run create myLambdaFunction \"arn:aws:iam::YOUR_AWS_ACCOUNT_ID:role/lambda_basic_execution\"" && exit 1;

echo "build..."

./scripts/build.sh

echo "create..."

aws lambda create-function \
  --function-name "$1" \
  --runtime nodejs \
  --role "$2" \
  --handler dist/index.handler \
  --timeout 6 \
  --memory-size 512 \
  --zip-file fileb://$(pwd)/dist/index.zip
