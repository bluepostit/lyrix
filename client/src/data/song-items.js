import useSWR from 'swr'
import { fetcher } from './common'

const useSongItems = () => {
  const { data, error } = useSWR(`/api/song-items`, fetcher)

  return {
    songItems: data ? data.songItems : data,
    actions: data ? data.actions : [],
    isLoading: !data && !error,
    error: error || (data ? data.error : null)
  }
}

const useSongItem = (id) => {
  const shouldFetch = id
  const url = `/api/song-items/${id}`
  const { data, error } = useSWR(shouldFetch ? url : null, fetcher)

  return {
    songItem: data ? data.songItem : null,
    actions: data ? data.actions : [],
    isLoading: shouldFetch && !data && !error,
    error
  }
}

export { useSongItem, useSongItems }
