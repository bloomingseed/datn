var jsdom = require('jsdom')
var axios = require('axios').default
const {JSDOM} = jsdom

function fetchHtml(url){
  return axios.get(url)
    .then(response=>response.data)
    .catch(error=>console.log(error))
}

function fetchHtmlLegacy(url){
  return axios.get(url)
    .then(response=>response.data)
    .then(html=>new JSDOM(html,'text/html').window.document)
    .catch(error=>console.log(error))
}

exports.fetchHtml = fetchHtml
