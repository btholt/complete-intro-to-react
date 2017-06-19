const MyTitle = props =>
  React.createElement('div', null, React.createElement('h1', { style: { color: props.color } }, props.myFavoriteShow));

const MyFirstComponent = () =>
  React.createElement('div', { id: 'my-first-component' }, [
    React.createElement(MyTitle, {
      color: 'peru',
      myFavoriteShow: 'Game of Thrones'
    }),
    React.createElement(MyTitle, {
      color: 'mediumaquamarine',
      myFavoriteShow: 'Westworld'
    }),
    React.createElement(MyTitle, {
      color: 'papayawhip',
      myFavoriteShow: 'House of Cards'
    })
  ]);

ReactDOM.render(React.createElement(MyFirstComponent), document.getElementById('app'));
