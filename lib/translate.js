import axios from 'axios'
import { chain, find, get, matchesProperty } from 'lodash'

import config from '../config.json'
import languages from '../languages.json'
import messages from '../messages.json'

const params = {
  'targetLanguage': 'zh-TW'
}

function command (text: string): Promise {
  return axios.get('https://www.googleapis.com/language/translate/v2?' +
    'q=' + text.trim() + '&' +
    'key=' + config.GOOGLE_API_KEY + '&' +
    'target=' + params.targetLanguage)
    .then(response => {
      const result = get(response, ['data', 'data', 'translations', 0])
      if (!result) {
        return {
          'response_type': 'in_channel',
          'attachments': [
            {
              'text': messages.RESULT_NOT_FOUND_TEXT,
              'color': 'danger'
            }
          ]
        }
      }

      const translatedText = get(result, 'translatedText')
      const detectedSourceLanguage = get(result, 'detectedSourceLanguage')

      return {
        'response_type': 'in_channel',
        'attachments': [
          {
            'fallback': translatedText,
            'thumb_url': `https://raw.githubusercontent.com/amowu/slack-lambda-google/feature/translate/icons/${detectedSourceLanguage}.png`,
            'fields': [
              {
                "title": get(languages, detectedSourceLanguage),
                "value": text,
                "short": true
              },
              {
                "title": get(languages, params.targetLanguage),
                "value": translatedText,
                "short": true
              }
            ]
          }
        ]
      }
   })
}

export { command }
