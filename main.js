const scraper = require('./src/lib/scraper')
;(async () => {
	const data = await scraper.getData()
	console.log(JSON.stringify(data))
})()
