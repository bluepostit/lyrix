import React from 'react'
import { PageHeader } from '../components'

const renderHeader = (props) => {
  if (props.noHeader) {
    return <></>
  } else {
    return (
      <PageHeader title={props.title} />
    )
  }
}

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