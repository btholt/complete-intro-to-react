const ce = React.createElement;

const MyTitle = function(props) {
  return ce(
    'div',
    null,
    ce('h1', { style: { color: props.color } }, props.title)
  );
};

const MyFirstComponent = function() {
  return ce(
    'div',
    null,
    ce(MyTitle, { title: 'Game of Throne', color: 'Blue' }),
    ce(MyTitle, { title: 'Rick and Morty', color: 'YellowGreen' }),
    ce(MyTitle, { title: 'Stranger Things', color: '#baddad' }),
    ce(MyTitle, { title: 'Parks and Rec', color: 'Green' })
  );
};

ReactDOM.render(ce(MyFirstComponent), document.getElementById('app'));
