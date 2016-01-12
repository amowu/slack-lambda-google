var AWS = require("aws-sdk");

var sns = new AWS.SNS();

exports.handler = function(event, context) {
  console.log(event);
  if ([
    "YOUR_SLACK_SLASH_COMMAND_TOKEN"
  ].indexOf(event.token) === -1) {
    return context.fail("Unauthorized Request")
  }
  sns.publish({
    Message: JSON.stringify({
      "default": JSON.stringify(event)
    }),
    MessageStructure: 'json',
    TopicArn: 'YOUR_SNS_TOPIC_ARN'
  }, function(error, data) {
    if (error) {
      console.log(error);
      return context.succeed({
        "response_type": "ephemeral",
        "attachments": [
          {
            "text": "YOUR_SOMETHING_ERROR_MSG",
            "color": "danger"
          }
        ]
      });
    } else {
      return context.succeed({
        "response_type": "in_channel"
      });
    }
  });
};
