const SELECTORS = ["body > div.container.w-1140.px-20.pt-20.bg-white.mx-auto > div:nth-child(2) > div.w-760.mr-40 > div.mt-10 > div > div.feature-box__content > h3 > a",
"body > div.container.w-1140.px-20.pt-20.bg-white.mx-auto > div:nth-child(3) > div > div.mb-25 > div > div.feature-box__content > h3 > a"]

async function getArticleUrls(page, url){
  console.log("Visiting "+ url)
  let urls = []
  await page.goto(url, {waitUntil: "domcontentloaded"});
  for(let i = 0; i<SELECTORS.length; ++i){
    let selector = SELECTORS[i];
    console.log("Waiting for "+ selector)
    await page.waitForSelector(selector)
    let moreLinks = await page.$$eval(selector, anchors => anchors.map(a=>a.href)); 
    for(let url of moreLinks) urls.push(url)
  }
  return urls;
}

exports.getArticleUrls = getArticleUrls;
