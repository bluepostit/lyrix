import React, { useEffect, useState } from 'react'

const ListDataset = ({
  url,
  loading = true,
  setLoading,
  onLoadingComplete
}) => {
  const [data, setData] = useState([])

  const fetchData = async () => {
    fetch(url)
      .then(res => res.json())
      .then((json) => {
        if (json.error) {
          throw json
        }
        setData(json.data)
        setLoading(false)
        onLoadingComplete(json.data)
      })
  }

  useEffect(() => {
    fetchData()
  }, [loading, data.length])

  return null
}

export { ListDataset }
