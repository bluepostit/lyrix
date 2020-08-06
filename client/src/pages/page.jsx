import React from 'react'
import { Navbar } from '../components'

const PageHeader = (props) => {
  if (props.noHeader) {
    return <></>
  }
  return <Navbar {...props} />
}

/**
 * Props:
 * - title - string to be used as the page's title
 * - content - string/JSX to be used as the page's content
 *
 * Also includes all props offered by Navbar.
 * @see Navbar
 * @param {*} props
 */
const Page = (props) => {
  return (
    <div className="page-content">
      <div className="list-page">
        <PageHeader {...props} />
        <div className="lyrix-page beneath-nav">
          {props.content}
        </div>
      </div>
    </div>
  )
}

export { Page }
