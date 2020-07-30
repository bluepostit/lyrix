import React from 'react'
import { useHistory } from "react-router-dom"
import { Icon } from '../components/icons'

const BaseButton = (props) => {
  if (!props.show) {
    return <></>
  }
  return (
    <button className="btn button-nav" onClick={props.onClick}>
      {props.icon}
    </button>
  )
}

const NextButton = (props) => {
  const icon = <Icon entity="action-next" />
  return <BaseButton icon={icon} {...props} />
}

const BackButton = (props) => {
  const icon = <Icon entity="action-prev" />
  return <BaseButton icon={icon} {...props} />
}

const HomeButton = (props) => {
  const icon = <Icon entity="home" />
  return <BaseButton icon={icon} {...props} />
}

const NewButton = (props) => {
  const icon = <Icon entity="new" />
  return <BaseButton icon={icon} {...props} />
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

  let hasBackButton = true
  if (props.hasOwnProperty('hasBackButton')) {
    hasBackButton = props.hasBackButton
  }

  let hasHomeButton = true
  if (props.hasOwnProperty('hasHomeButton')) {
    hasHomeButton = props.hasHomeButton
  }


  return (
    <nav className="navbar navbar-light mobile-header">
      <div className="button-group">
        <BackButton onClick={goBack} show={hasBackButton} />
        <HomeButton onClick={goHome} show={hasHomeButton} />
      </div>
      <h1>{props.title}</h1>
      <div className="button-group">
        <NewButton onClick={props.onNewClick} show={props.onNewClick} />
        <NextButton onClick={goNext} show={props.nextLink} />
      </div>
    </nav>
  )
}

export { Navbar }
