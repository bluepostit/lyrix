import useSWR from 'swr'
import { fetcher } from './common'

const useSongSearch = (query, fetch = true) => {
  const shouldFetch = query && fetch
  const urlQuery = new URLSearchParams({ q: query }).toString()
  const url = `/api/song-importer/search?${urlQuery}`
  const { data, error, mutate } = useSWR(
    shouldFetch ? url : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  return {
    songs: data ? data.songs : null,
    isLoading: shouldFetch && !data && !error,
    mutate,
    error
  }
}

export { useSongSearch }
