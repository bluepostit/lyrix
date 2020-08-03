import { useEffect, useState } from 'react'

const ListDataset = ({
  url,
  loading = true,
  setLoading,
  onLoadingComplete
}) => {
  const [data, setData] = useState([])

  const fetchData = () => {
    fetch(url)
      .then(res => res.json())
      .then((json) => {
        if (json.error) {
          throw json
        }
        setData(json)
        setLoading(false)
        onLoadingComplete(json)
      })
  }

  useEffect(() => {
    fetchData()
  }, [loading, data.length])

  return null
}

export { ListDataset }
