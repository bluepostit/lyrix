import React from 'react'
import { useHistory } from "react-router-dom"

const NextLink = (props) => {
  if (!props.link) {
    return (
      <></>
    )
  }
  return (
    <button className="btn button-nav" onClick={props.onClick}>
      <i className="fas fa-arrow-right"></i>
    </button>
  )
}

const PageHeader = (props) => {
  const history = useHistory()
  const goBack = () => {
    history.goBack()
    window.scrollTo(0, 0)
  }
  const goHome = () => {
    history.push('/')
  }
  const goNext = () => {
    history.push(props.nextLink)
    window.scrollTo(0, 0)
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
      <NextLink link={props.nextLink} onClick={goNext} />
    </div>
  )
}

export { PageHeader }
