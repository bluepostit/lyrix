import useSWR from 'swr'
import { fetcher } from './common'

const useArtists = () => {
  const { data, error, mutate } = useSWR(`/api/artists`, fetcher)

  return {
    artists: data ? data.artists : data,
    actions: data ? data.actions : [],
    isLoading: !data && !error,
    error,
    mutate
  }
}

const useArtist = (id) => {
  const { data, error } = useSWR(`/api/artists/${id}`, fetcher)

  return {
    artist: data ? data.artist : null,
    actions: data ? data.actions : [],
    isLoading: !data && !error,
    error
  }
}

export { useArtist, useArtists }
