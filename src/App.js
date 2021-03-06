import React, { Component } from 'react';
import giphy from './components/giphy';
import array from 'lodash/array';
import Search from './components/Search/Search';
import Gif from './components/Gif/Gif';

class App extends Component {
  constructor() {
    super();

    this.state = {
      gifs: [],
      currentGif: null,
      randomLimit: 3
    };

    this.giphy = new giphy(20);
    console.log('init', performance.now());
  }

  componentDidMount() {
    console.log('pre-pop', performance.now());
    //this.populateRandom();
  }

  populateRandom() {
    for(var i=0;i<this.state.randomLimit;i++) {
      this.giphy.random()
        .then(response => {
          console.log('Success:', performance.now());
          this.setState(prevState => prevState.gifs.push(response.data));
        })
        .catch(error => console.error('Error:', error));
    }
  }

  updateGifs = result => {
    this.setState({
      gifs: result.data,
      currentGif: array.head(result.data)
    });
  }

  moveGif = (direction) => {
    let length = this.state.gifs.length;
    let index = this.state.gifs.indexOf(this.state.currentGif);
    let next = this.state.gifs[(length + index + direction) % length];

    this.setState({currentGif: next});
  }

  render() {
    return (
      <div className="App">
        <div className="App-container">
          <Search giphy={this.giphy} updateGifs={this.updateGifs} />
          <Gif moveGif={this.moveGif} gif={this.state.currentGif} />
        </div>
      </div>
    );
  }
}

export default App;