import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from 'formik'

import { MobileHeader } from '../../components'
import { MEDIA_CLASS_SMALL, MEDIA_CLASS_LARGE } from '../../common'

const SmallScreenContent = (props) => {
  const onFormSubmit = async (values, { setSubmitting }) => {
    fetch('/songlists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify(values)
    })
    .then(response => response.json())
    .then((data) => {
      setSubmitting(false)
      console.log(data)
      // TO DO: handle server errors!
      if (data.status === 200) {
        console.log('created list')
        // TO DO: redirect to show the newly created list
      }
    })
  }

  return (
    <div className={MEDIA_CLASS_SMALL}>
      <div className="list-page">
        <MobileHeader title={props.title} />
        <Formik
          initialValues={{ title: '' }}
          onSubmit={onFormSubmit}  
        >
          {({ errors, isSubmitting }) => (
            <Form>
              <Field type="text" name="title" />
              <ErrorMessage name="title" component="div" />
              <button type="submit" disabled={isSubmitting}>Submit</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

const BigScreenContent = (props) => {
  return (
    <div className={MEDIA_CLASS_LARGE}>
      <div className="container banner-vcenter d-flex flex-column justify-content-center">
        <div className="text-center">
          <h1>{props.title}</h1>
        </div>
      </div>
      To Be Implemented...
    </div>
  )
}

const NewSonglist = () => {
  const title = 'Add a Songlist'
  return (
    <div className="songlist-page">
      <SmallScreenContent title={title} />
      <BigScreenContent title={title} />
    </div>
  )
}

export { NewSonglist }