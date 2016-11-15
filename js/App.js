import React from 'react'
import { Match } from 'react-router'
import { Provider } from 'react-redux'
import store from './store'
import AsyncRoute from './AsyncRoute'
import preload from '../public/data.json'
if (global) {
  global.System = { import () {} }
}

const App = () => {
  return (
    <Provider store={store}>
      <div className='app'>
        <Match
          exactly
          pattern='/'
          component={(props) => <AsyncRoute props={props} loadingPromise={System.import('./Landing')} />}
        />
        <Match
          pattern='/search'
          component={(props) => {
            return <AsyncRoute props={Object.assign({shows: preload.shows}, props)} loadingPromise={System.import('./Search')} />
          }}
        />
        <Match
          pattern='/details/:id'
          component={(props) => {
            const show = preload.shows.filter((show) => props.params.id === show.imdbID)
            return <AsyncRoute props={Object.assign({show: show[0]}, props)} loadingPromise={System.import('./Details')} />
          }}
        />
      </div>
    </Provider>
  )
}

export default App
