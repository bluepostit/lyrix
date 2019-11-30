import React from 'react';
import './App.css';

const testCallApi = async () => {
  const response = await fetch('/artists')
  const json = await response.json()
  return json
}


function App() {
  testCallApi()
    .then(json => {
      document.querySelector('body').innerHTML =
        `<h1>There are ${json.data.length} songs in the database</h1>`    
    })
  return (
    <div className="App"></div>
  );
}

export default App;
