import React from 'react'
import { Navbar } from '../components'

/**
 * Props:
 * - title - string to be used as the page's title
 * - children - string/JSX to be used as the page's content
 * - noNavbar - if true, render no navbar
 *
 * Also includes all props offered by Navbar.
 * @see Navbar
 * @param {object} props
 */
const Page = ({
  title,
  actions,
  noNavbar = false,
  children
}) => {
  let header
  if (!noNavbar) {
    header = <Navbar actions={actions} title={title} />
  }
  return (
    <div className={"lyrix-page " + (noNavbar ? '' : 'has-navbar')}>
      {header}
      <div className="content-wrapper">
        {children}
      </div>
    </div>
  )
}

export { Page }
