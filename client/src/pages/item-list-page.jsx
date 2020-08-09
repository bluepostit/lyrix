import React from 'react'
import { Page } from './page'
import { EmptyPage } from './empty-page'

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
 * - renderItem() - function to render an individual item in the list
 * - renderItemMultiLine() - OPTIONAL boolean: whether to render multi-line content for each item
 *
 * @param {*} props
 */
const ItemListPage = ({
  items,
  actions,
  title,
  children,
   ...props
}) => {
  if (!items || items.length < 1) {
    return (
      <EmptyPage title={title} actions={actions}>
        {children}
      </EmptyPage>
    )
  }

  return (
    <Page title={title} actions={actions}>
      <div className="page-content list-page">
        <ItemListDiv items={items} {...props} />
        {children}
      </div>
    </Page>
  )
}

export { ItemListPage }
