import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom"
import { Navbar } from '../components/headers'

// A single list item
const Item = ({
  item,
  index,
  onItemClick,
  renderItemMultiLine = false,
  renderItem = (item, index) => {}
}) => {
  const handleClick = () => {
    onItemClick(item)
  }

  let className = "list-group-item lyrix-list-item"
  if (renderItemMultiLine) {
    className += " multi-line"
  }

  return (
    <button key={item.id} className={className} onClick={handleClick} >
        {renderItem(item, index)}
    </button>
  )
}

// A list of items
const ItemListDiv = ({
  items = [],
  onItemClick,
  show = true,
  renderItemMultiLine = false,
  renderItem = (item, index) => { }
}) => {
  if (items.length === 0) {
    let className = 'beneath-nav lyrix-list empty ' + (show? '' : 'd-none')
    return (
      <div className={className}>
        <h3>Nothing to show here, yet.</h3>
      </div>
    )
  }
  return (
    <div className="list-group lyrix-list">
      {items.map((item, index) =>
        <Item
          key={index}
          index={index}
          item={item}
          onItemClick={onItemClick}
          renderItemMultiLine={renderItemMultiLine}
          renderItem={renderItem}
        />
      )}
    </div>
  )
}

const fetchItems = async (getItems, setUserCanCreate) => {
  if (typeof getItems === 'function') {
    return await getItems()
  } else {
    return fetch(getItems)
      .then(response => response.json())
      .then((json) => {
        if (json.error) {
          throw json
        }
        const actions = json.actions
        if (actions && actions.create) {
          setUserCanCreate(actions.create)
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
const ItemListPage = ({getItems, noHeader, ...props}) => {
  const [items, setItems] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [userCanCreate, setUserCanCreate] = useState(false)
  const history = useHistory()

  useEffect(() => {
    setLoading(true)
    fetchItems(getItems, setUserCanCreate)
      .then((items) => {
        setItems(items)
        setLoading(false)
      })
      .catch((e) => {
        console.log('Something went wrong!')
        console.log(e)
        history.push('/login')
      })
  }, [history, getItems, items.length]) // things to monitor for render
  // See https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects

  let navbar = <></>
  if (!noHeader) {
    navbar = <Navbar userCanCreate={userCanCreate} {...props} />
  }

  return (
    <div className="page-content">
      <div className="list-page">
        {navbar}
        <ItemListDiv items={items} show={!isLoading} {...props} />
      </div>
    </div>
  )
}

export { ItemListPage }
