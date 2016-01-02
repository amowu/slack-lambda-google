![slack-lambda-google](https://cloud.githubusercontent.com/assets/559351/12033086/4eb38aba-ae5a-11e5-8dbf-50e82f94424d.png)

# Google God

A serverless [Slack Slash Commands](https://api.slack.com/slash-commands) to integrate [Google Knowledge Graph API](https://developers.google.com/knowledge-graph/) using [AWS Lambda](https://aws.amazon.com/lambda/) and [AWS API Gateway](https://aws.amazon.com/api-gateway/).

![screenshot](https://cloud.githubusercontent.com/assets/559351/12034616/835b2ad4-ae6e-11e5-8b89-fc7b486fd47e.gif)

## Getting Started

This project was built with Ryan Ray's repo [slack-lambda-weather](https://github.com/ryanray/slack-lambda-weather) and his [post](http://www.ryanray.me/serverless-slack-integrations).

### Prerequisites

* Install [AWS CLI](https://aws.amazon.com/cli/)
* Create a `config.json` based on `config.sample.json`. This file is gitignored by default because this is where you would put any API key's, AWS settings, and other secret info that your lambda may need.
* [Google Knowledge Graph Search API](https://developers.google.com/knowledge-graph/) API key, and paste it to `config.json`.

### AWS Lambda

> Lambda is based on EC2 and allows you to deploy and execute your code (Node.js, Java, Python) without having to provision servers.

Deploy and update your Lambda code:

```sh
npm start
```

### AWS API Gateway

> Lambda responds to events, which can come from a variety of sources. By default Lambda isn't accessable from a URL, but API Gateway allows you to map a URL and an HTTP method to trigger your Lambda code. You can setup GET, POST, PUT, etc... and map the parameters/body into a JSON payload that Lambda understands.

1. Goto [AWS API Gateway](https://aws.amazon.com/api-gateway/) and Create new API - name it whatever you want - we'll do LambdaTest for now
2. Create a new resource, name it whatever
3. Create a POST method under your resource
4. Select Integration type with Lambda Function, and select your Lambda region, and enter your Lambda function name
5. Save and give API Gateway permission to invoke your Lambda function
6. Click on Integration Request > Mapping Templates
7. Add mapping Template for `application/x-www-form-urlencoded` and click checkmark
8. Change input passthrough to mapping template and paste this template [gist](https://gist.github.com/ryanray/668022ad2432e38493df) that can help you to convert `application/x-www-form-urlencoded` POST from Slack to Lambda's `application/json` format
9. Save and click Deploy API with a new stage, then you can see a public invoke URL

### Slack

1. Goto Slack App `https://YOUR_TEAN_DOMAIN.slack.com/apps/manage`
2. Search `Slash Commands` and add a new configuration
3. Choose a command, for this example enter `/google` in the command name input, click Add Slash Command Integration button.
4. Now you should be on the settings page, scroll down and copy the token to your `config.json` (NOTE: you don't want to expose the token to the public!).
5. Copy and paste your API Gateway invoke URL to URL field.

## Contributing

Improvements are welcome! Just fork, push your changes to a new branch, and create a pull request!

![slack-lambda-google-ex](https://cloud.githubusercontent.com/assets/559351/12034120/721ea5a4-ae67-11e5-8d7a-297cbaa1a51d.png)