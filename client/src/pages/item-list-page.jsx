import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom"
import { Page } from './page'

// A single list item
const Item = (props) => {
  const item = props.item
  const history = useHistory()

  const handleClick = () => {
    props.onItemClick(item, history)
  }

  return (
    <button key={item.id} className="list-group-item lyrix-list-item"
      onClick={handleClick} >
        {props.renderItem(item)}
    </button>
  )
}

const ListHeader = (props) => {
  const history = useHistory()

  const handleNewClick = () => {
    props.onNewClick(history)
  }

  return (
    <span>
      {props.title}
      <button className="btn my-0 py-0 pr-0" onClick={handleNewClick}>
        <i className="fa fa-plus color-primary"></i>
      </button>
    </span>
  )
}

// A list of items
const ItemListDiv = (props) => {
  return (
    <div className="list-group lyrix-list">
      {props.items.map((item, index) =>
        <Item key={index} item={item} onItemClick={props.onItemClick} renderItem={props.renderItem} />
      )}
    </div>
  )
}

const fetchItems = async (getItems) => {
  if (typeof getItems === 'function') {
    return await getItems()
  } else {
    return fetch(getItems)
      .then(response => response.json())
      .then((json) => {
        if (json.error) {
          throw json
        }
        return json.data
      })
  }
}

/**
 * Requires the following props:
 * - title - string to be used at the top of the page
 * - getItems() - async function returning an array of items
 * - onNewClick() - function to handle clicking 'New'; usually a redirect
 * - onItemClick() - function to handle clicking individual item; usually a redirect
 * - renderItem() - function to render an individual item in the list
 *
 * @param {*} props
 */
const ItemListPage = (props) => {
  const [items, setItems] = useState([])
  const history = useHistory()

  useEffect(() => {
    fetchItems(props.getItems)
      .then(items => setItems(items))
      .catch((e) => {
        console.log('Something went wrong!')
        console.log(e)
        history.push('/login')
      })
  }, [history, props, items.length]) // things to monitor for render
  // See https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects

  return (
    <div className="items-list-page">
      <Page
        content={<ItemListDiv items={items} onItemClick={props.onItemClick} renderItem={props.renderItem} />}
        title={<ListHeader title={props.title} onNewClick={props.onNewClick} />}
      />
    </div>
  )
}

export { ItemListPage }
