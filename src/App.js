import React, { Component } from 'react';
import giphy from './giphy';
import array from 'lodash/array';
import Search from './Search';
import './App.css';

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

  copyGIF = (gif) => {
    var text = gif.bitly_url;
    navigator.clipboard.writeText(text).then(function() {
      console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-container">
          <Search giphy={this.giphy} updateGifs={this.updateGifs} />
          <div className="gif-container">
              {this.state.currentGif && (
                <video className="gif" autoPlay playsInline loop preload="auto" src={this.state.currentGif.images.preview.mp4}></video>
              )}
              <div className="controls">
                <button className="interactable interactable-hover" disabled={this.state.currentGif === null} onClick={() => this.moveGif(-1)}>&laquo;&nbsp;Previous</button>
                <button className="interactable interactable-hover" disabled={this.state.currentGif === null} onClick={() => this.moveGif(1)}>Next&nbsp;&raquo;</button>
                <button className="interactable interactable-hover" disabled={this.state.currentGif === null} onClick={() => this.copyGIF(this.state.currentGif)}>Copy</button>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;