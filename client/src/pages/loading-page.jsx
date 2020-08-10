import React from 'react'
import { Page } from './page'
import { Spinner } from 'react-bootstrap'

const LoadingPage = ({
  title = <h2>Lyrix</h2>,
  actions,
  message = "Loading..."
}) => {
  return (
    <Page title={title} actions={actions}>
      <div className="page-content list-page">
        <div className="lyrix-list empty">
          <div className="d-flex">
            <Spinner animation="border" role="status" />
            <h3 className="container">{message}</h3>
          </div>
        </div>
      </div>
    </Page>
  )
}

export default LoadingPage
