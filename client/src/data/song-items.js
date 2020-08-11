import useSWR from 'swr'
import { fetcher } from './common'

const useSongItems = () => {
  const { data, error } = useSWR(`/api/song-items`, fetcher)

  return {
    songItems: data ? data.songItems : data,
    actions: data ? data.actions : [],
    isLoading: !data && !error,
    error
  }
}

const useSongItem = (id) => {
  const { data, error } = useSWR(`/api/song-items/${id}`, fetcher)

  return {
    songItem: data ? data.songItem : null,
    actions: data ? data.actions : [],
    isLoading: !data && !error,
    error
  }
}

export { useSongItem, useSongItems }
