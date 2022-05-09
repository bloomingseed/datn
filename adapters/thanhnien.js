const SELECTOR = "#st-container > div > div.site-content > div:nth-child(6) > div.w-content.list-content-left > div.cate-content > div.zone--timeline > div > article > a"

async function getArticleUrls(page, url){
  console.log("Visiting "+ url)
  await page.goto(url, {waitUntil: "domcontentloaded"});
  console.log("Waiting for "+ SELECTOR)
  await page.waitForSelector(SELECTOR)
  return await page.$$eval(SELECTOR, anchors => anchors.map(a=>a.href));
}

exports.getArticleUrls = getArticleUrls;
