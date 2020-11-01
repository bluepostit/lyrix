import React from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Page } from './page'

const DraggableListItem = (props) => {
  const item = props.item
  return (
    <Draggable draggableId={item.id.toString()}
               index={props.index}
    >
      {(provided, snapshot) => (
        <div ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {
            props.renderItem(item, props.index, props.onItemClick,
              props.onItemDeleteClick)
          }
        </div>
      )}
    </Draggable>
  )
}

const DraggableList = (props) => {
  return (
    <DragDropContext onDragEnd={props.onDragEnd}>
      <Droppable droppableId="droppableList">
        {(provided, snapshot) => (
          <div className="list-group lyrix-list"
            {...provided.droppableProps}
            ref={provided.innerRef}>
              {props.items.map((item, index) => (
                <DraggableListItem
                  key={item.id}
                  item={item}
                  index={index}
                  renderItem={props.renderItem}
                  onItemClick={props.onItemClick}
                  onItemDeleteClick={props.onItemDeleteClick}
                />
              ))}
              {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

const List = ({
  items,
  renderItem,
  onItemClick,
  onItemDeleteClick,
  onDragEnd
}) => {
  if (onDragEnd) {
    return (
      <DraggableList
        items={items}
        renderItem={renderItem}
        onItemClick={onItemClick}
        onItemDeleteClick={onItemDeleteClick}
        onDragEnd={onDragEnd}
      />
    )
  } else {
    return (
      <div className="list-group lyrix-list">
        {items.map((item, index) =>
          renderItem(item, index, onItemClick, onItemDeleteClick)
        )}
      </div>
    )
  }
}
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
  onDragEnd = null,
   ...props
}) => {
  return (
    <Page title={title} actions={actions}>
      <div className="page-content list-page">
        <List
          items={items}
          renderItem={renderItem}
          onItemClick={onItemClick}
          onItemDeleteClick={onItemDeleteClick}
          onDragEnd={onDragEnd}
        />
        {children}
      </div>
    </Page>
  )
}

export { ItemListPage }
