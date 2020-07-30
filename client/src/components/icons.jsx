import React from 'react'

const getFontAwesomeClass = (entity) => {
  let className = ''
  switch (entity) {
    case 'artist':
      className = 'fas fa-user-circle'
    break
    case 'song':
      className = 'fas fa-microphone'
    break
    case 'songlist':
      className = 'fas fa-clipboard-list'
    break
    default:
      className = 'fas fa-file-alt' // lyric/file image
    break
  }
  className += ' lyrix-icon'
  return className
}

/**
 *
 * @param {*} props
 * - entity string, eg. 'artist', 'user', 'song', 'songlist'
 */
const Icon = (props) => {
  const entity = props.entity || 'default'
  const className = getFontAwesomeClass(entity)
  return (
    <i className={className}></i>
  )
}

export { Icon }
