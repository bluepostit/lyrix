import React from 'react'
import { Page } from './page'

const EmptyPage = ({
  title = <h2>Lyrix</h2>,
  actions,
  children,
  message = "Nothing to show here, yet."
}) => {
  return (
    <Page title={title} actions={actions}>
      <div className="page-content list-page">
        <div className="lyrix-list empty">
          <h3>{message}</h3>
          {children}
        </div>
      </div>
    </Page>
  )
}

export { EmptyPage }
