import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const testCallApi = async () => {
  const response = await fetch('/artists')
  const json = await response.json()
  return json
}

function CategoryCard (props) {
  return (
    <div className="card-category">
      <h3>{props.title}</h3>
      <p>{props.subtitle}</p>
    </div>
  )
}


function App() {
  // testCallApi()
  //   .then(json => {
  //     document.querySelector('body').innerHTML =
  //       `<h1>There are ${json.data.length} songs in the database</h1>`
  //   })
  return (
    <div className="App">
      <div className="container banner-vcenter d-flex flex-column justify-content-center">
        <div>
          <h1>Welcome to Lyrix!</h1>
          <p>Your lyrics managing companion</p>
          <div className="card-category-wrapper col-12 col-lg-6 offset-lg-3">
            <CategoryCard title="Artists"
                          link="/artists"
                          subtitle="All my people right here right now" />
            <CategoryCard title="Songs" link="/songs" />
            <CategoryCard title="Sets" />
            <CategoryCard title="Gigs" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
