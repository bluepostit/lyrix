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

/**
 *
 * @param {*} props object containing the following:
 * - title - (any) content to be displayed in the center of the navbar
 * - nextLink - (string) OPTIONAL link to navigate to when clicking 'next' (right arrow).
 *              If not provided, no right arrow will show.
 * -
 */
const Navbar = (props) => {
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
    <nav className="navbar navbar-light mobile-header">
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
    </nav>
  )
}

export { Navbar }
