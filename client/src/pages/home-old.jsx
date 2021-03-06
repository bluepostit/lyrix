import React, { useState } from 'react'
import { MenuButton } from '../components/buttons'

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

const PageContent = (props) => {
  return (
    <div className="page-content">
      <div className="d-sm-block">
        <div className="menu-title mb-5">Lyrix</div>
        <div className="menu-buttons">
          <MenuButton action="arrange" />
          <MenuButton action="practice" />
          <MenuButton action="perform" />
        </div>
      </div>
      <div className="d-none d-sm-block">
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
  )
}

const Home = (props) => {
  const [songCount, setSongCount] = useState(0)

  getSongCount()
    .then(count => setSongCount(count))

  return (
    <div className="home-page">
      <PageContent songCount={songCount} />
    </div>
  )
}

export { Home }
