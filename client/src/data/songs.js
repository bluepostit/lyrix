import useSWR from 'swr'
import { fetcher } from './common'

const useSongs = () => {
  const { data, error } = useSWR(`/api/songs`, fetcher)

  return {
    songs: data ? data.songs : data,
    actions: data ? data.actions : [],
    isLoading: !data && !error,
    error
  }
}

const useSong = ({id, artistId, songlistId}) => {
  let url = `/api/songs/${id}`
  if (songlistId) {
    url += `?context=songlist&contextId=${songlistId}`
  } else if (artistId) {
    url += '?context=artist'
  } else {
    url += '?context=songlist' // Assumed context: ALL songs
  }
  const shouldFetch = id
  const { data, error, mutate } = useSWR(shouldFetch ? url : null, fetcher)

  return {
    song: data ? data.song : null,
    actions: data ? data.actions : [],
    isLoading: shouldFetch && !data && !error,
    mutate,
    error
  }
}

export { useSong, useSongs }
