import React from 'react'
import { useHistory } from "react-router-dom"

const PageHeader = (props) => {
  const history = useHistory()
  const goBack = () => {
    history.goBack()
  }
  const goHome = () => {
    history.push('/')
  }

  return (
    <div className="mobile-header">
      <div>
        <button className="btn button-nav" onClick={goBack}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <button className="btn button-nav" onClick={goHome}>
          <i className="fas fa-home"></i>
        </button>
      </div>
      <h1>{props.title}</h1>
    </div>
  )
}

export { PageHeader }
