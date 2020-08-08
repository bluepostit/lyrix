import React from 'react'

const FormError = (props) => {
  if (props.error) {
    return (
      <div className="alert alert-danger lyrix-form-error" role="alert">
        {props.error}
      </div>
    )
  } else {
    return <></>
  }
}

export { FormError }
