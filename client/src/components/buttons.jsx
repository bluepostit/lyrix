import React from 'react'

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

export { ToTopButton }
