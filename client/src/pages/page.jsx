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
 * - nextLink - string to be used as the 'next' link. Can be undefined.
 * - hasBackButton - boolean, for navbar
 * - hasHomeButton - boolean, for navbar
 *
 * @param {*} props
 */
const Page = (props) => {
  return (
    <div className="page-content">
      <div className="list-page">
        <PageHeader {...props} />
        {props.content}
      </div>
    </div>
  )
}

export { Page }
