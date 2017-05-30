/* eslint no-console: 0 */
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const buffer = fs.readFileSync('./data.json');
const showsObj = JSON.parse(buffer);
const app = express();
app.use(cors());
const ratedShows = showsObj.shows.map(show =>
  Object.assign({ rating: `${Math.floor(Math.random() * 9)}.${Math.floor(Math.random() * 9)}` }, show)
);

app.get('/:id', (req, res) => {
  const show = ratedShows.find(item => item.imdbID === req.params.id);
  if (show) {
    console.log(show.title);
    setTimeout(() => res.json(show), Math.floor(Math.random() * 5000));
  } else {
    console.log(404, req.params.id);
    res.status(404).json({ error: 'show not found' });
  }
});

console.log(`Starting server on port 3000`);
console.log(`Generating new random ratings`);
app.listen(3000);
