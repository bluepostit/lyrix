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
  const { data, error } = useSWR(`/api/songlists/${id}`, fetcher)

  return {
    songlist: data ? data.songlist : null,
    actions: data ? data.actions: [],
    isLoading: !data && !error,
    error
  }
}

export { useSonglists, useSonglist }
