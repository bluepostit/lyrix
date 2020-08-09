import React from 'react'
import { Page } from './page'

const EmptyPage = ({
  title,
  actions,
  children
}) => {
  return (
    <Page title={title} actions={actions}>
      <div className="page-content list-page">
        <div className="lyrix-list empty">
          <h3>Nothing to show here, yet.</h3>
          {children}
        </div>
      </div>
    </Page>
  )
}

export { EmptyPage }
