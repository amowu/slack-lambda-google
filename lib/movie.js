import axios from 'axios'
import { get, reduce, repeat } from 'lodash'

const params = {
  'count': 4
}

function command (text: string): Promise {
  return axios.get('https://api.douban.com/v2/movie/search?' +
    'q=' + text.trim() + '&' +
    'count=' + params.count)
    .then(response => movie(response))
}

function movie (response) {
  const subjects = get(response, ['data', 'subjects'])
  const subject = subjects.shift()
  return subject ? {
    'response_type': 'in_channel',
    'attachments': [
      {
        'title': get(subject, 'title'),
        'title_link': get(subject, 'alt'),
        'text': text(subject),
        'fields': fields(subject, subjects),
        'thumb_url': get(subject, ['images', 'small'])
      }
    ]
  } : {
    'response_type': 'in_channel',
    'attachments': [
      {
        'text': '',
        'color': 'danger'
      }
    ]
  }
}

function text (subject) {
  const {
    original_title,
    year,
    genres
  } = subject

  return `${original_title}\n${year} ${reduce(genres, (result, genre) => `${result} ${genre}`, '')}`
}

function fields (subject, subjects) {
  const {
    casts,
    directors,
    rating
  } = subject

  return [
    {
      'title': '導演',
      'value': reduce(directors, (result, director) => `${result}\n${link(get(director, 'alt'), get(director, 'name'))}`, ''),
      'short': true
    },
    {
      'title': '評分',
      'value': `${star(rating)} ${get(rating, 'average')}`,
      'short': true
    },
    {
      'title': '主演',
      'value': reduce(casts, (result, cast) => `${result}\n${link(get(cast, 'alt'), get(cast, 'name'))}`, ''),
      'short': true
    },
    {
      'title': '相關結果',
      'value': reduce(subjects, (result, s) => `${result}\n${link(get(s, 'alt'), get(s, 'title'))}`, ''),
      'short': true
    }
  ]
}

function star (rating) {
  const {
    average,
    max,
    min
  } = rating
  const MAX_STAR = 5
  const star = Math.round(average / ((max - min) / MAX_STAR))

  return repeat('★', star) + repeat('☆', MAX_STAR - star)
}

function link (url, name) {
  return url ? `<${url}|${name}>` : name
}

export { command }
