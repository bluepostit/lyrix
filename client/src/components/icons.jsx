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
    case 'action-prev':
      className = 'fas fa-arrow-left'
      break
    case 'action-next':
      className = 'fas fa-arrow-right'
      break
    case 'home':
      className = 'fas fa-home'
      break
    case 'new':
      className = 'fas fa-plus'
      break
    case 'song-item':
      className = 'fas fa-file-alt'
      break
    case 'edit':
      className = 'fas fa-edit'
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
