// sports and health have different format thus
// will be done in separate strategies
var fetchHtml = require("../lib/fetchHtml")
const ENCODINGS = {
  'politics': 180,
  'business': 90,
  'world': 122,
  'entertainment': 87,
  'life': 132,
  'education': 166,
  'legal': 179,
  'tech': 109,
}
const LIMIT = 50;
const BASE_URL = 'https://vtv.vn'

async function crawl(page, subject, callback = undefined){
  await page.goto('https://vtv.vn/chinh-tri.htm');
  let links = [];
  for(let i = 0; i<LIMIT; ++i){
    let container = await fetchHtml(`https://vtv.vn/timeline/${ENCODINGS[subject]}/trang-${i+1}.htm`)
    let moreLinks = Array.from(container.querySelectorAll('a[data-linktype="newsdetail"]')).map(a=>a.href);
    for(let link of moreLinks) links.push(BASE_URL + link);
    console.log(i, links.length);
  }
  return links;
}

exports.ENCODINGS = ENCODINGS
exports.crawl = crawl;
