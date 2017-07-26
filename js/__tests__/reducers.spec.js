// @flow

import reducers from '../reducers';

test('@@INIT', () => {
  const state = reducers(undefined, {});
  expect(state).toEqual({ searchTerm: '', apiData: {} });
});

test('SET_SEARCH_TERM', () => {
  const state = reducers({ searchTerm: '', apiData: {} }, { type: 'SET_SEARCH_TERM', payload: 'orange' });
  expect(state).toEqual({ searchTerm: 'orange', apiData: {} });
});

test('ADD_API_DATA', () => {
  const state = reducers(
    { searchTerm: 'orange', apiData: {} },
    {
      type: 'ADD_API_DATA',
      payload: {
        rating: '0.8',
        title: 'Orange Is the New Black',
        year: '2013–',
        description: 'The story of Piper Chapman, a woman in her thirties who is sentenced to fifteen months in prison after being convicted of a decade-old crime of transporting money for her drug-dealing girlfriend.',
        poster: 'oitnb.jpg',
        imdbID: 'tt2372162',
        trailer: 'th8WT_pxGqg'
      }
    }
  );
  expect(state).toEqual({
    searchTerm: 'orange',
    apiData: {
      tt2372162: {
        rating: '0.8',
        title: 'Orange Is the New Black',
        year: '2013–',
        description: 'The story of Piper Chapman, a woman in her thirties who is sentenced to fifteen months in prison after being convicted of a decade-old crime of transporting money for her drug-dealing girlfriend.',
        poster: 'oitnb.jpg',
        imdbID: 'tt2372162',
        trailer: 'th8WT_pxGqg'
      }
    }
  });
});
