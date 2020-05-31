const cheerio = require('cheerio')
const util = require('../util')

const URL_PREFIX_SEARCH = 'https://genius.com/search?q='
const URL_PREFIX_LYRICS = 'https://genius.com/'

// Should launch a search page, find the top result, and return its URL
// Instead, attempts to return the URL in the form <search query>-lyrics.
// This will only work (AFAIK) if the query is in the form "<artist> <title>", converted to kebab-case.
const getSongPageUrl = async (query) => {
  // UNFINISHED
  // console.log('about to search')
  // const pageContent = await util.getContent(`${INITIAL_SEARCH_URL}${query}`)
  // TO DO: now parse the page for the first result URL, etc.
  // (Note: this did not present the search results when I tried!)

  let suffix = `${util.toKebabCase(query)}-lyrics`
  return `${URL_PREFIX_LYRICS}${suffix}`
}

class GeniusSongImporter {
  async search (query) {
    const songPageUrl = await getSongPageUrl(query)
    console.log('song page url is: ')
    console.log(songPageUrl)
    const page = await util.getContent(songPageUrl)

    const $ = cheerio.load(page)
    const lyrics = $('div[class^="SongPage__Section"]').first().text()
    console.log(lyrics)
    const title = $('h1').first().text()
    const artist = $('[class*="SongHeader__Artist"]').text()

    return {
      lyrics,
      title,
      artist
    }
  }
}

module.exports = GeniusSongImporter
