var config = require('./config.json');
var messages = require('./messages.json');
var google = require('./lib/google.js');

/**
 * Entrypoint for AWS Lambda
 * @param event is the JSON payload that API Gateway transformed from slack's application/x-www-form-urlencoded request
 * @param context has methods to let Lambda know when we're done - similar to http/express modules `response.send()`
 */
exports.handler = function (event, context) {
  console.log(event);

  // Verify request came from slack
  if (event.token !== config.SLASH_COMMANDS_TOKEN) {
    return context.fail(messages.UNAUTHORIZED_TOKEN);
  }

  google(event.text)
    .then(function (response) {
      context.succeed(response);
    })
    .catch(function (error) {
      console.error(error);
      context.succeed({
        'response_type': 'in_channel',
        'attachments': [
          {
            'fallback': messages.ERROR_FALLBACK,
            'text': messages.ERROR_TEXT,
            'color': 'danger'
          }
        ]
      });
    });
};
