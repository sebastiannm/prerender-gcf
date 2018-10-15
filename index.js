const puppeteer = require('puppeteer')
let page

async function getBrowserPage() {
  // Launch headless Chrome. Turn off sandbox so Chrome can run under root.
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  return browser.newPage()
}

exports.prerender = async (req, res) => {
  const url = req.query.url

  if (!url) {
    return res.send(
      'Please provide URL as GET parameter, for example: <a href="?url=https://example.com">?url=https://example.com</a>'
    )
  }

  if (!page) {
    page = await getBrowserPage()
  }

  await page.goto(url, {
    waitUntil: 'networkidle2'
  })
  const bodyHTML = await page.evaluate(() => document.documentElement.outerHTML)
  res.set('Content-Type', 'text/html')
  res.send(bodyHTML)
}
