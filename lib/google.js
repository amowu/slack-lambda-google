import axios from 'axios'
import { chain, find, get, matchesProperty } from 'lodash'

import config from '../config.json'
import messages from '../messages.json'

// Language priority for search result
const languages = [
  'zh-TW',
  'zh',
  'en',
  'ja'
]
// Google API params
const params = {
  'limit': 1,
  'languages': 'zh,en,ja'
}

export default function (text: string): Promise {
  return axios.get('https://kgsearch.googleapis.com/v1/entities:search?' +
    'query=' + text.trim() + '&' +
    'key=' + config.GOOGLE_API_KEY + '&' +
    'limit=' + params.limit + '&' +
    'languages=' + params.languages)
    .then(response => {
      const result = get(response, ['data', 'itemListElement', 0, 'result'])
      if (!result) {
        return {
          'response_type': 'in_channel',
          'attachments': [
            {
              'fallback': messages.RESULT_NOT_FOUND,
              'text': messages.RESULT_NOT_FOUND_TEXT,
              'color': 'danger'
            }
          ]
        }
      }

      const title = get(item(result, 'name', '@language'), '@value')
      const detailedDescription = item(result, 'detailedDescription' ,'inLanguage')

      return {
        'response_type': 'in_channel',
        'attachments': [
          {
            'fallback': title,
            'title': title,
            'title_link': get(detailedDescription, 'url'),
            'text': get(detailedDescription, 'articleBody'),
            'thumb_url': get(result, ['image', 'contentUrl'])
          }
        ]
      }
   })
}

/**
 * Get only one item from search result by language priority list
 * @param  {Object} result   search result
 * @param  {string} children item name
 * @param  {string} key      item language property name
 * @return {Object}          filter result
 */
function item (result: any, children: string, key: string): any {
  const items = chain(result).get(children).value()
  const language = chain(languages).filter(lang =>
    find(items, matchesProperty(key, lang))
  ).first().value()

  return find(items, matchesProperty(key, language))
}
