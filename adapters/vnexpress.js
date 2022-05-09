const SELECTOR = "#automation_TV0 > div.width_common.list-news-subfolder.has-border-right > article > h2 > a"

async function getArticleUrls(page, url){
  console.log("Visiting "+ url)
  await page.goto(url, {waitUntil: "domcontentloaded"});
  console.log("Waiting for "+ SELECTOR)
  await page.waitForSelector(SELECTOR)
  return await page.$$eval(SELECTOR, anchors => anchors.map(a=>a.href));
}

exports.getArticleUrls = getArticleUrls;
