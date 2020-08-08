import { useEffect, useRef } from 'react'

const fetchArtist = async (id) => {
  const artist = await fetch(`/artists/${id}`)
    .then(response => response.json())
    .then(json => json.data)
  return artist
}

const fetchSonglist = async (id) => {
  const songlist = await fetch(`/songlists/${id}`)
    .then(response => response.json())
    .then(json => json.data)
  return songlist
}

const fetchSongs = async (song, songlistId) => {
  let songs = []
  if (songlistId !== undefined) {
    const songlist = await fetchSonglist(songlistId)
    songs = songlist.songs
  } else {
    const artist = await fetchArtist(song.artist.id)
    songs = artist.songs
  }
  return songs
}

const getNextSong = (song, songs) => {
  let nextSong = null
  const index = songs.findIndex(arrSong => arrSong.id === song.id)
  if (index >= 0 && index < songs.length - 1) {
    nextSong = songs[index + 1]
  }
  return nextSong
}

/**
 * Get the relative URL for the next song.
 * If a songlist ID is given, look for the next song in the songlist.
 * If not, look for the given song's artist's next song.
 * If none found, return null
 *
 * @param {Song} song
 * @param {integer|null} songlistId
 * @return {string} a relative URL for the next song, or null if not found
 */
const getNextSongLink = async (song, songlistId) => {
  if (!song || !song.title) {
    return null
  }

  let nextSongLink = ''
  let songs = await fetchSongs(song, songlistId)
  const nextSong = getNextSong(song, songs)
  if (!nextSong) {
    return null
  }

  if (songlistId) {
    nextSongLink = `/songlists/${songlistId}`
  }
  nextSongLink += `/songs/${nextSong.id}`
  return nextSongLink
}

const toTitleCase = (string) => {
  const words = string.split(/\W+/)
  const titles = words.map((word) => {
    return word.slice(0, 1).toUpperCase()
      + word.slice(1).toLowerCase()
  })
  return titles.join(' ')
}

const pluralize = (number, word) => {
  if (number === 1) {
    return `1 ${word}`
  } else {
    return `${number} ${word}s`
  }
}

// From https://stackoverflow.com/a/51082563
function useTraceUpdate(props) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.log('Changed props:', changedProps);
    }
    prev.current = props;
  });
}

export { getNextSongLink, pluralize, toTitleCase, useTraceUpdate }
