import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import { MEDIA_CLASS_SMALL, MEDIA_CLASS_LARGE } from '../common'


const pluralize = (number, noun) => {
  let str = `${number} song`
  if (number !== 1) {
    str += 's'
  }
  return str
}

const getSongCount = async () => {
  const response = await fetch('/songs/count')
  const json = await response.json()
  return json.data
}

function CategoryCard (props) {
  return (
    <div className="card-category">
      <h3>{props.title}</h3>
      <p>{props.subtitle}</p>
    </div>
  )
}

/**
 * Menu button for small screen's home page
 */
const MenuButton = (props) => {
  const action = props.action
  const title = action[0].toUpperCase() + action.slice(1)

  const history = useHistory()

  const handleMenuButtonClick = (e) => {
    const url = '/' + e.target.dataset.action
    history.push(url)
  }

  const className = `btn btn-primary menu-button menu-button-${action}`
  return (
    <button className={className}
            data-action={action}
            onClick={handleMenuButtonClick}>{title}
    </button>
  )
}

const SmallScreenContent = (props) => {
  return (
    <div className={MEDIA_CLASS_SMALL}>
      <div className="menu-title">Lyrix</div>
      <div className="menu-buttons">
        <MenuButton action="arrange" />
        <MenuButton action="practice" />
        <MenuButton action="perform" />
      </div>
    </div>
  )
}

const BigScreenContent = (props) => {
  return (
    <div className={MEDIA_CLASS_LARGE}>
      <div className="container banner-vcenter d-flex flex-column justify-content-center">
        <div className="text-center">
          <h1>Welcome to Lyrix!</h1>
          <p>Your lyrics managing companion</p>
          <div className="card-category-wrapper col-12 col-lg-6 offset-lg-3">
            <CategoryCard title="Artists"
                          link="/artists"
                          subtitle="All my people, right here right now" />
            <CategoryCard title="Songs"
                          link="/songs"
                          subtitle={`We have ${pluralize(props.songCount, 'song')}`} />
            <CategoryCard title="Sets" />
            <CategoryCard title="Gigs" />
          </div>
        </div>
      </div>
    </div>
  )
}


const Home = (props) => {
  const [songCount, setSongCount] = useState(0)

  getSongCount()
    .then(count => setSongCount(count))

  return (
    <div className="home-page">
      <SmallScreenContent />
      <BigScreenContent songCount={songCount} />
    </div>
  )
}

export { Home }