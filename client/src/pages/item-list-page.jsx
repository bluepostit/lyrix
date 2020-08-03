import React from 'react'
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

const EmptyMessage = ({
  show
}) => {
  let className = 'beneath-nav lyrix-list empty ' + (show ? '' : 'd-none')
  return (
    <div className={className}>
      <h3>Nothing to show here, yet.</h3>
    </div>
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
const ItemListPage = ({
  items,
  actions,
  loading,
  noHeader,
   ...props
}) => {
  let navbar = <></>
  if (!noHeader) {
    navbar = <Navbar actions={actions} {...props} />
  }

  let contents = <EmptyMessage show={!loading} />
  if (items.length > 0) {
    contents = <ItemListDiv items={items} show={!loading} {...props} />
  }

  return (
    <div className="page-content">
      <div className="list-page">
        {navbar}
        {contents}
      </div>
    </div>
  )
}

export { ItemListPage }
