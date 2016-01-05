import axios from 'axios'
import { get } from 'lodash'

import config from './config.json'
import messages from './messages.json'
import google from './lib/google.js'

type SlackRequestObject = {
  token: string,
  team_id: string,
  team_domain: string,
  channel_id: string,
  channel_name: string,
  user_id: string,
  user_name: string,
  command: string,
  text: string,
  response_url: string
}

/**
 * Entrypoint for AWS Lambda, this Lambda function receive Slack Slash Commands request from AWS SNS, and then send back a result response to Slack client.
 * @param event is a AWS SNS Object that transformed from Slack's application/x-www-form-urlencoded request
 * @param context has methods to let Lambda know when we're done, similar to express modules `response.send()`
 */
export function handler (event: any, context: any): void {
  console.log(event)

  // Verify request came from SNS
  const sns = get(event, ['Records', 0, 'Sns', 'Message'])
  if (!sns) {
    return context.fail(messages.SNS_MESSAGE_NOT_FOUND)
  }

  // Convert SNS message to JSON
  const payload: SlackRequestObject = JSON.parse(sns)
  console.log(payload)

  // Verify request had a right Slack token
  if (payload.token !== config.SLASH_COMMANDS_TOKEN) {
    return context.fail(messages.UNAUTHORIZED_TOKEN)
  }

  // Run command module and then send back a response to Slack client
  google(payload.text)
    .then(response => {
      axios.post(payload.response_url, response)
        .then(done => context.succeed(done))
        .catch(error => context.fail(error))
    })
    .catch(error => {
      console.error(error)
      axios.post(payload.response_url, {
        'response_type': 'in_channel',
        'attachments': [
          {
            'fallback': messages.ERROR_FALLBACK,
            'text': messages.ERROR_TEXT,
            'color': 'danger'
          }
        ]
      }).then(done => context.succeed(done))
        .catch(error => context.fail(error))
    })
}
