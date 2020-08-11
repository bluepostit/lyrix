import React from 'react'

const ICON_CLASSES = {
  artist: 'fas fa-user-circle',
  song: 'fas fa-microphone',
  songlist: 'fas fa-clipboard-list',
  previous: 'fas fa-arrow-left',
  next: 'fas fa-arrow-right',
  home: 'fas fa-home',
  new: 'fas fa-plus',
  edit: 'fas fa-edit',
  delete: 'fas fa-trash',
  songItem: 'fas fa-file-alt',
  import: 'fas fa-cloud-upload-alt',
  login: 'fas fa-sign-in-alt',
  logout: 'fas fa-sign-out-alt',
  star: 'fas fa-star',
  default: 'fas fa-star'
}

const getFontAwesomeClass = (entity) => {
  let className = ICON_CLASSES[entity] || ICON_CLASSES.default
  className += ' lyrix-icon'
  return className
}

/**
 *
 * @param {*} props
 * - entity string, eg. 'artist', 'user', 'song', 'songlist'
 */
const Icon = ({ entity = 'songItem' }) => {
  const className = getFontAwesomeClass(entity)
  return (
    <i className={className}></i>
  )
}

export { Icon }
