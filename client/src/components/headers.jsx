import React from 'react'
import { useHistory } from "react-router-dom"

const MobileHeader = (props) => {
  const history = useHistory()
  const goBack = () => {
    history.goBack()
  }

  return (
    <div className="mobile-header">
      <button className="btn button-nav" onClick={goBack}>
        <i className="fas fa-arrow-left"></i>
      </button>
      <h1>{props.title}</h1>
    </div>
  )
}

export { MobileHeader }
