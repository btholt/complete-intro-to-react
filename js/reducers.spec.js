import reducers from './reducers'

test('@@INIT', () => {
  let state
  state = reducers(undefined, {})
  expect(state).toEqual({searchTerm: '', omdbData: {}})
})

test('SET_SEARCH_TERM', () => {
  let state
  state = reducers({searchTerm: '', omdbData: {}}, {type: 'SET_SEARCH_TERM', searchTerm: 'house'})
  expect(state).toEqual({searchTerm: 'house', omdbData: {}})
})

test('ADD_OMDB_DATA', () => {
  let state
  state = reducers({searchTerm:'',omdbData:{}}, {type:'ADD_OMDB_DATA',imdbID:'tt3986586',omdbData:{Title:'Fuller House',Year:'2016–',Rated:'TV-G',Released:'26 Feb 2016',Runtime:'30 min',Genre:'Comedy, Family',Director:'N/A',Writer:'Jeff Franklin',Actors:'Candace Cameron Bure, Jodie Sweetin, Andrea Barber, Michael Campion',Plot:'In a continuation of Full House, D.J. Fuller is a mother of three young boys and is a recent widow. D.J.\'s sister Stephanie, her best friend Kimmy and Kimmy\'s teenage daughter all move in to help raise her sons. The house is now a lot fuller.',Language:'English',Country:'USA',Awards:'1 win.',Poster:'https://images-na.ssl-images-amazon.com/images/M/MV5BMTU2NzA0ODAyMF5BMl5BanBnXkFtZTgwNDE5MTIxMDI@._V1_SX300.jpg',Metascore:'N/A',imdbRating:'7.2',imdbVotes:'13,415',imdbID:'tt3986586',Type:'series',totalSeasons:'2',Response:'True'}})
  expect(state).toEqual({searchTerm:'',omdbData:{tt3986586:{Title:'Fuller House',Year:'2016–',Rated:'TV-G',Released:'26 Feb 2016',Runtime:'30 min',Genre:'Comedy, Family',Director:'N/A',Writer:'Jeff Franklin',Actors:'Candace Cameron Bure, Jodie Sweetin, Andrea Barber, Michael Campion',Plot:'In a continuation of Full House, D.J. Fuller is a mother of three young boys and is a recent widow. D.J.\'s sister Stephanie, her best friend Kimmy and Kimmy\'s teenage daughter all move in to help raise her sons. The house is now a lot fuller.',Language:'English',Country:'USA',Awards:'1 win.',Poster:'https://images-na.ssl-images-amazon.com/images/M/MV5BMTU2NzA0ODAyMF5BMl5BanBnXkFtZTgwNDE5MTIxMDI@._V1_SX300.jpg',Metascore:'N/A',imdbRating:'7.2',imdbVotes:'13,415',imdbID:'tt3986586',Type:'series',totalSeasons:'2',Response:'True'}}})
})

