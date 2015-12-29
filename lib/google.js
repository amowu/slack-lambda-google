var _ = require('lodash');
var request = require('request-promise');

var config = require('../config.json');
var messages = require('../messages.json');

// Language priority for search result
var languages = [
  'zh-TW',
  'zh',
  'en',
  'ja'
];
// Google API params
var params = {
  'limit': 1,
  'languages': 'zh,en,ja'
};

module.exports = function (text) {
  return request('https://kgsearch.googleapis.com/v1/entities:search?' +
    'query=' + text.trim() + '&' +
    'key=' + config.GOOGLE_API_KEY + '&' +
    'limit=' + params.limit + '&' +
    'languages=' + params.languages)
    .then(function (response) {
      var data = JSON.parse(response);

      var result = _.get(data, ['itemListElement', 0, 'result']);
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
        };
      }

      var name = item(result, 'name', '@language');
      var title = _.get(name, '@value');

      var detailedDescription = item(result, 'detailedDescription' ,'inLanguage');

      return {
        'response_type': 'in_channel',
        'attachments': [
          {
            'fallback': title,
            'title': title,
            'title_link': _.get(detailedDescription, 'url'),
            'text': _.get(detailedDescription, 'articleBody'),
            'thumb_url': _.get(result, ['image', 'contentUrl'])
          }
        ]
      };
    });
};

/**
 * Get only one item from search result by language priority list
 * @param  {Object} result   search result
 * @param  {string} children item name
 * @param  {string} key      item language property name
 * @return {Object}          filter object
 */
function item (result, children, key) {
  var items = _.chain(result).get(children).value();
  var language = _.chain(languages).filter(function (lang) {
    return _.find(items, _.matchesProperty(key, lang));
  }).first().value();

  return _.find(items, _.matchesProperty(key, language));
}
