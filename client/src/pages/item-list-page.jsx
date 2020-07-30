import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom"
import { Navbar } from '../components/headers'

// A single list item
const Item = (props) => {
  const item = props.item

  const handleClick = () => {
    props.onItemClick(item)
  }

  let className = "list-group-item lyrix-list-item"
  if (props.renderItemMultiLine) {
    className += " multi-line"
  }

  return (
    <button key={item.id} className={className} onClick={handleClick} >
        {props.renderItem(item, props.index)}
    </button>
  )
}

// A list of items
const ItemListDiv = (props) => {
  return (
    <div className="list-group lyrix-list">
      {props.items.map((item, index) =>
        <Item key={index} index={index} item={item} {...props} />
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
 * Uses the following props:
 * - title - string to be used at the top of the page
 * - getItems() - async function returning an array of items
 * - onNewClick() - function to handle clicking 'New'; usually a redirect
 * - onItemClick() - function to handle clicking individual item; usually a redirect
 * - renderItem() - function to render an individual item in the list
 * - renderItemMultiLine() - OPTIONAL boolean: whether to render multi-line content for each item
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

  let navbar = <></>
  if (!props.noHeader) {
    navbar = <Navbar {...props} />
  }

  return (
    <div className="page-content">
      <div className="list-page">
        {navbar}
        <ItemListDiv items={items} {...props} />
      </div>
    </div>
  )
}

export { ItemListPage }
