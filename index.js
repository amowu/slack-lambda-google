import config from './config.json'
import messages from './messages.json'
import google from './lib/google.js'

type Event = {
  token: string,
  team_id: string,
  team_domain: string,
  channel_id: string,
  channel_name: string,
  user_id: string,
  user_name: string,
  command: string,
  text: string
}

/**
 * Entrypoint for AWS Lambda
 * @param event is the JSON payload that API Gateway transformed from slack's application/x-www-form-urlencoded request
 * @param context has methods to let Lambda know when we're done - similar to http/express modules `response.send()`
 */
export function handler (event: Event, context: any): void {
  console.log(event)

  // Verify request came from slack
  if (event.token !== config.SLASH_COMMANDS_TOKEN) {
    return context.fail(messages.UNAUTHORIZED_TOKEN)
  }

  google(event.text)
    .then(response => {
      context.succeed(response)
    })
    .catch(error => {
      console.error(error)
      context.succeed({
        'response_type': 'in_channel',
        'attachments': [
          {
            'fallback': messages.ERROR_FALLBACK,
            'text': messages.ERROR_TEXT,
            'color': 'danger'
          }
        ]
      })
    })
}
