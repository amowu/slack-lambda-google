import axios from 'axios'
import { get } from 'lodash'

import config from './config.json'
import messages from './messages.json'

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
  // Verify request came from SNS
  const sns = get(event, ['Records', 0, 'Sns', 'Message'])
  if (!sns) {
    console.log(messages.SNS_MESSAGE_NOT_FOUND)
    return context.fail(messages.SNS_MESSAGE_NOT_FOUND)
  }

  // Convert SNS message to JSON
  const payload: SlackRequestObject = JSON.parse(sns)
  console.log(payload)

  // Verify request had a right Slack token
  if (config.SLASH_COMMANDS_TOKEN_LIST.indexOf(payload.token) === -1) {
    console.log(messages.UNAUTHORIZED_TOKEN)
    return context.fail(messages.UNAUTHORIZED_TOKEN)
  }

  // Load module by Slack command
  const { command } = require('./lib' + payload.command + '.js')

  // Run command module and then send back a response to Slack client
  command(payload.text)
    .then(response => {
      console.log(response)
      axios.post(payload.response_url, response)
        .then(done => context.succeed(done))
        .catch(error => context.fail(error))
    })
    .catch(error => {
      console.log(error)
      axios.post(payload.response_url, {
        'response_type': 'in_channel',
        'attachments': [
          {
            'text': messages.ERROR_TEXT,
            'color': 'danger'
          }
        ]
      }).then(done => context.succeed(done))
        .catch(error => context.fail(error))
    })
}
