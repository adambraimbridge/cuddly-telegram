const cheerio = require('cheerio')
const fetch = require('node-fetch')
const startURL = 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects'

;(async () => {
	try {
		console.log('start')
		const startResponse = await fetch(startURL)
		const startText = await startResponse.text()
		const $ = cheerio.load(startText)
		const cards = []
		$('#quick-links .toggle').each((i, section) => {
			const card = {
				section: $(section)
					.find('summary')
					.text(),
			}
			$(section)
				.find('li', 'a')
				.each((i, item) => {
					cards.push(
						Object.assign({}, card, {
							title: $(item)
								.text()
								.trim(),
							description: $(item)
								.find('a')
								.first()
								.attr('title'),
						})
					)
				})
		})
		console.log(cards)
	} catch (error) {
		console.error(error)
	}
})()
