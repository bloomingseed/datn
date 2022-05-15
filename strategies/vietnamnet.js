const SELECTOR = "#maincontent"
const TIMEOUT = 30000

async function crawl(url, page){
  try{
    console.log(`Fetching ${url}...`)
    await page.goto(url, {waitUntil: "domcontentloaded"});
    await page.waitForSelector(SELECTOR, {timeout: TIMEOUT})
    return await page.$eval(SELECTOR, div=>{
      while(div.firstElementChild.tagName != "P") div = div.firstElementChild

      let elms = Array.from(div.querySelectorAll("p"))
      elms.slice(elms.length - 1, 1);
      return elms.map(elm=>elm.innerText.trim()).join('\n')
    });
  } catch(e){
    console.log("Failed to extract text from link " + url)
    console.log(e);
  }
}

exports.crawl = crawl;
