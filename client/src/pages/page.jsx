import React from 'react'
import { Navbar } from '../components'

const renderHeader = (props) => {
  if (props.noHeader) {
    return <></>
  } else {
    return (
      <Navbar title={props.title} nextLink={props.nextLink} />
    )
  }
}

/**
 * Props:
 * - title - string to be used as the page's title
 * - content - string/JSX to be used as the page's content
 * - nextLink - string to be used as the 'next' link. Can be undefined.
 *
 * @param {*} props
 */
const Page = (props) => {
  return (
    <div className="page-content">
      <div className="list-page">
        {renderHeader(props)}
        {props.content}
      </div>
    </div>
  )
}

export { Page }
