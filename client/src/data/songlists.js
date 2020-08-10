import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const useSonglists = () => {
  const { data, error } = useSWR(`/api/songlists`, fetcher)

  return {
    songlists: data ? data.songlists : data,
    isLoading: !data && !error,
    error
  }
}

export { useSonglists }
