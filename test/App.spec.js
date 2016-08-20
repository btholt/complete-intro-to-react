/* eslint-env mocha */


/* chai is the assertion library 
we want to specifically pull the expect function from the chai library*/
const {expect} = require('chai')

describe('<Search />', () => {
  it('should pass', (=> {
    expect(1 + 1 === 2).to.be.true
  }))
})
