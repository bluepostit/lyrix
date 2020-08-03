import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom"

const ListDataset = ({
  url,
  loading = true,
  setLoading,
  onLoadingComplete
}) => {
  const [data, setData] = useState([])
  const [error, setError] = useState('')

  const fetchData = () => {
    fetch(url)
      .then(res => res.json())
      .then((json) => {
        if (json.error) {
          setError(json)
        }
        setData(json)
        setLoading(false)
        onLoadingComplete(json)
      })
  }

  useEffect(() => {
    fetchData()
  }, [loading, data.length])

  return (
    <>
      <ErrorHandler error={error} />
    </>
  )
}

const ErrorHandler = ({
  error,
}) => {
  const history = useHistory()
  if (error) {
    console.log(error)
    history.push('/login')
  }
  return <></>
}

export { ListDataset }
