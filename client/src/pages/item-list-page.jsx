import React from 'react'
import { Page } from './page'

/**
 * Uses the following props:
 * - title - string to be used at the top of the page
 * - renderItem - function to render an individual item in the list
 * - renderItemMultiLine() - OPTIONAL boolean: whether to render multi-line content for each item
 *
 * @param {*} props
 */
const ItemListPage = ({
  items,
  actions,
  title,
  children,
  renderItem,
  onItemClick,
  onItemDeleteClick,
   ...props
}) => {
  return (
    <Page title={title} actions={actions}>
      <div className="page-content list-page">
        <div className="list-group lyrix-list">
          {items.map((item, index) =>
            renderItem(item, index, onItemClick, onItemDeleteClick)
          )}
        </div>
        {children}
      </div>
    </Page>
  )
}

export { ItemListPage }
