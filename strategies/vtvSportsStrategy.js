var {fetchHtml} = require("../lib/fetchHtml")
const LIMIT = 13;

async function crawl(page, callback = undefined){
  let links = [];
  for(let i = 0; i<LIMIT; ++i){
    await page.goto(`https://vtv.vn/the-thao/special/trang-${i+1}.htm`);
    //await page.goto(`https://vtv.vn/the-thao/special/trang-13.htm`);
    await page.waitForSelector('div[class="showall"]')
    let moreLinks = await page.$$eval('div[class="showall"]', container =>{
      container = container[0]
      return Array.from(container.querySelectorAll("h3 a")).map(a=>a.href)
    })
    for(let link of moreLinks){
      
      links.push(link);
    } 
    console.log(i, links.length);

  }
  return links;
}
async function extractText(csvWriter, link, page){
  console.log(`Fetching ${link}...`)
  try {
    /*
    var dom = await fetchHtml(link)
    var content = dom.querySelector("#entry-body")
    content.removeChild(content.lastElementChild);
    content.removeChild(content.lastElementChild);
    content = content.textContent.trim()
    */
    var html = await fetchHtml(link)
    await page.setContent(html)
    var content = await page.$eval('#entry-body', div=>{
      div.removeChild(div.lastElementChild)
      if(div.lastElementChild.tagName != 'P'){
        div.removeChild(div.lastElementChild)
      }
      return div.innerText.trim();
    })
    console.log(`Writing text content to csv file...`)
    csvWriter.write({
      category: "sports",
      source: "vtv.vn",
      link: link,
      text: content
    })
    console.log(`Done ${link}`)
  } catch(e){
    console.log("Failed to extract text from link " + link)
    console.log(e)
    throw e;
  }
}

exports.crawl = crawl;
exports.extractText = extractText
exports.label = 'sports';
