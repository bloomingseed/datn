const SELECTOR = "body > main > div.body-container > div:nth-child(2) > div.grid-dleft.singular-wrap > div > article > div.singular-content"
const TIMEOUT = 30000

async function crawl(url, page){
  try{
    console.log(`Fetching ${url}...`)
    await page.goto(url, {waitUntil: "domcontentloaded"});
    await page.waitForSelector(SELECTOR, {timeout: TIMEOUT})
    return await page.$eval(SELECTOR, div=>{
      div.children[div.children.length - 2].remove();
      return div.innerText.trim();
    });
  } catch(e){
    console.log("Failed to extract text from link " + url)
    console.log(e);
  }
}

exports.crawl = crawl;
