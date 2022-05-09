# Process
## config.yaml
- Schema: an array of {name, templates, limit}
- name: source name
- templates: 10 template strings to create url to get articles urls for this {source, template} (10 templates = 10 categories)
- limit: number of pages to crawl for each template (category)

## Crawling
- Read the config file, then
```
for source_id in 1..config.length do:
  source = config[source_id]
  for category_id in 1..source.templates do
    template = source.templates[category_id]
    data = []
    for i in 1..source.limit do
      indexUrl = template + i
      articleUrls = adapters[source.name].crawl(indexUrl)
      for url in articleUrls do
        # consider using batch processing here
        text = strategies[source.name].crawl(url)
        data.push({category_id, source_id, url, text})
      end
    end
    writeCsv(data, forceWrite = false)
  end
end
```
## Adapter
- Input: articles index page url
- Output: articles url
```
puppeteerPage.goTo(indexUrl)
urls = puppetterPage.$$eval(articleUrlSelector, elms => elms.map(elm=>elm.href))
return urls
```
- TODO: inspect index page to find out `articleUrlSelector`
## Strategy
- Input: List of article urls
- Output: article content
```
contents = []
for url in articleUrls do
  puppeteerPage.goTo(url)
  content = puppeteerPage.$eval(contentSelector, div=>{
    removeAds(div)
    return div.innerText()
  })
  contents.push(content)
end
return contents

```
- TODO: inspect source page to find out `contentSelector` and proper `removeAds(div)` function
