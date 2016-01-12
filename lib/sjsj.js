import axios from 'axios'
import { get } from 'lodash'

function command (text: string): Promise {
  return axios.get(`https://raw.githubusercontent.com/HugoGiraudel/SJSJ/master/glossary/${text.trim().toUpperCase()}.md`)
    .then(response => {
      return {
        'response_type': 'in_channel',
        'text': get(response, 'data')
      }
    })
}

export { command }
