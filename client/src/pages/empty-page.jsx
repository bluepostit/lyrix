import React from 'react'
import { Page } from './page'

const EmptyPage = ({
  title,
  actions
}) => {
  return (
    <Page title={title} actions={actions}>
      <div className="page-content list-page">
        <div className="lyrix-list empty">
          <h3>Nothing to show here, yet.</h3>
        </div>
      </div>
    </Page>
  )
}

export { EmptyPage }
