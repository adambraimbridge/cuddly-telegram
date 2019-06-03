const cheerio = require('cheerio')
const fetch = require('node-fetch')
const unflatten = require('flat').unflatten

/**
 * @param {String} url
 * @returns {Object} Cheerio DOM object
 */
const getDOM = async url => {
	try {
		const response = await fetch(url)
		const html = await response.text()
		return cheerio.load(html)
	} catch (error) {
		console.error(error)
	}
}

const getPages = ($, selector) => {
	const pages = {}
	const menuDom = $(selector).toArray()
	for (a of menuDom) {
		const href = $(a).attr('href') || ''
		if (!href.includes('Reference')) continue
		const key = href
			.replace(/\/en-US\/docs\/Web\/JavaScript\/Reference\/?/, '')
			.trim()
			.toLowerCase()
		if (!key) continue
		pages[key] = {
			href,
			title: $(a).text(),
			description: $(a).attr('title'),
		}
	}
	return pages
}

module.exports.getData = async () => {
	const $ = await getDOM('https://developer.mozilla.org/en-US/docs/Web/JavaScript')
	const pages = getPages($, '#quick-links a')
	const data = Object.assign({}, pages)
	for (let page of Object.values(pages)) {
		const $ = await getDOM(`https://developer.mozilla.org${page.href}`)
		Object.assign(data, getPages($, '#quick-links [data-default-state = "open"] a'))
	}
	return unflatten(data, { delimiter: '/' })
}
