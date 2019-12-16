import React, { useState } from 'react';


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

const Home = (props) => {
  const [songCount, setSongCount] = useState(0)

  getSongCount()
    .then(count => setSongCount(count))

  return (
    <div className="container banner-vcenter d-flex flex-column justify-content-center">
      <div>
        <h1>Welcome to Lyrix!</h1>
        <p>Your lyrics managing companion</p>
        <div className="card-category-wrapper col-12 col-lg-6 offset-lg-3">
          <CategoryCard title="Artists"
                        link="/artists"
                        subtitle="All my people, right here right now" />
          <CategoryCard title="Songs"
                        link="/songs"
                        subtitle={`We have ${pluralize(songCount, 'song')}`} />
          <CategoryCard title="Sets" />
          <CategoryCard title="Gigs" />
        </div>
      </div>
    </div>
  )
}

export { Home }