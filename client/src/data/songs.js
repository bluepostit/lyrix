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

const useSong = (id) => {
  const { data, error } = useSWR(`/api/songs/${id}`, fetcher)

  return {
    song: data ? data.song : null,
    actions: data ? data.actions : [],
    isLoading: !data && !error,
    error
  }
}

export { useSong, useSongs }
