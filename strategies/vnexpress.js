const SELECTOR = "#dark_theme > section.section.page-detail.top-detail > div > div.sidebar-1 > article"
const TIMEOUT = 5000

async function crawl(url, page){
  try{
    console.log(`Fetching ${url}...`)
    await page.goto(url, {waitUntil: "domcontentloaded"});
    await page.waitForSelector(SELECTOR, {timeout: TIMEOUT})
    return await page.$eval(SELECTOR, div=>{
      div.lastElementChild.remove();
      div.lastElementChild.remove();
      return div.innerText.trim();
    });
  } catch(e){
    console.log("Failed to extract text from link " + url)
    console.log(e);
  }
}

exports.crawl = crawl;
