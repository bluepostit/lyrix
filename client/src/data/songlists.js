import useSWR from 'swr'
import { fetcher } from './common'

const useSonglists = () => {
  const { data, error } = useSWR(`/api/songlists`, fetcher)

  return {
    songlists: data ? data.songlists : data,
    isLoading: !data && !error,
    error
  }
}

const useSonglist = (id) => {
  const url = `/api/songlists/${id}`
  const { data, error, mutate } = useSWR(url, fetcher)

  return {
    songlist: data ? data.songlist : null,
    actions: data ? data.actions: [],
    isLoading: !data && !error,
    mutate,
    error
  }
}

export { useSonglists, useSonglist }
