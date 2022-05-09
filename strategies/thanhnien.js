const SELECTOR = "#abody > p"
const TIMEOUT = 5000

async function crawl(url, page){
  try{
    console.log(`Fetching ${url}...`)
    await page.goto(url, {waitUntil: "domcontentloaded"});
    await page.waitForSelector(SELECTOR, {timeout: TIMEOUT})
    return await page.$$eval(SELECTOR, elms=>{
      return elms.map(elm=>elm.innerText.trim()).join('\n')
    });
  } catch(e){
    console.log("Failed to extract text from link " + url)
    console.log(e);
  }
}

exports.crawl = crawl;
