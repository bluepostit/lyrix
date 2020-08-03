import React, { useEffect, useState } from 'react'

const ListDataset = ({
  url,
  loading = true,
  setLoading,
  onLoadingComplete
}) => {
  const [items, setItems] = useState([])
  const [actions, setActions] = useState([])

  const fetchItems = async () => {
    fetch(url)
      .then(res => res.json())
      .then((json) => {
        if (json.error) {
          throw json
        }
        setActions(json.actions)
        setItems(json.data)
        setLoading(false)
        onLoadingComplete({
          items: items,
          actions: actions
        })
      })
  }

  useEffect(() => {
    fetchItems()
  }, [loading, items.length])

  return null
}

export { ListDataset }
