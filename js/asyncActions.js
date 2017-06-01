// @flow

import axios from 'axios';
import { addAPIData } from './actionCreators';

export default function getAPIDetails(imdbID: string) {
  return (dispatch: Function) => {
    axios
      .get(`http://localhost:3000/${imdbID}`)
      .then(response => {
        dispatch(addAPIData(response.data));
      })
      .catch(error => {
        console.error('axios error', error); // eslint-disable-line no-console
      });
  };
}
