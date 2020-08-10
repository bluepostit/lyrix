import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const useUser = () => {
  const { data, error } = useSWR('/api/user/status', fetcher)

  return {
    user: data,
    isLoading: !data && !error,
    error
  }
}

export default useUser
