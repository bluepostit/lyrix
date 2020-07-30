import React from 'react'
import { useHistory } from "react-router-dom"

const ToTopButton = (props) => {
  const onClick = () => {
    window.scrollTo(0, 0)
  }

  return (
    <button className="btn button-nav button-to-top" onClick={onClick}>
      <i className="fas fa-arrow-up"></i>
    </button>
  )
}

/**
 * Menu button for small screen
 */
const MenuButton = (props) => {
  const action = props.action
  const title = action[0].toUpperCase() + action.slice(1)

  const history = useHistory()

  const handleMenuButtonClick = () => {
    const url = `/${action}`
    history.push(url)
  }

  const icon = props.icon || <></>

  const className = `btn btn-primary menu-button menu-button-${action}`
  return (
    <button className={className}
            data-action={action}
            onClick={handleMenuButtonClick}>
      {icon}{title}
    </button>
  )
}


export { ToTopButton, MenuButton }
