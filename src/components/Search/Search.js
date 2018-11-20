import React, { Component } from 'react';
import fp from 'lodash/function';
import array from 'lodash/array';
import Results from '../Results/Results';
import './search.css';

class Search extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            results: [],
            currentResult: [],
            resultsActive: false,
            query: '',
            limitMessage: '',
        }

        this.giphy = props.giphy;
        this.debouncedSearch = fp.debounce(this.populateSearch, 500);
    }

    componentDidMount() {
        this.getSavedResults();
    }

    handleInput = (event) => {
      this.setState({query: event.target.value});
      this.toggleResults(true);
      this.debouncedSearch();
    }
    
    handleSearchError = response => {
      let limitMessage = '';
  
      if (typeof response.status === 'undefined' || response.status === 429) {
        limitMessage = 'API requests per hour limit reached.'
      }
  
      this.setState(prevState => ({
        limitMessage: limitMessage
      }));
      this.toggleResults(false);
      console.error('Error:', response.data);
    }
    
    handleSearchSuccess = response => {
      let result = {query: this.state.query, data: response.data.data};
  
      this.setState(prevState => ({
        currentResult: result,
        results: [result].concat(prevState.results),
        limitMessage: ''
      }));

      this.props.updateGifs(result);
      this.toggleResults(false);
      this.saveResult(result);
      console.log('Search Response:', performance.now(), response.data);
    }
  
    populateSearch = () => {
      if (this.state.query === '') {
        return;
      }

      
      if (!this.useCacheIfAvailable()) {
          this.giphy.search(this.state.query)
              .then(response => {
                  if (response.status !== 200) {
                  this.handleSearchError(response);
                  } else {
                  this.handleSearchSuccess(response);
                  }
              })
              .catch(this.handleSearchError);
      }
    }

    useCacheIfAvailable = () => {
      let cachedResult = this.retrieveCachedResult();

      if (cachedResult !== undefined) {
          this.selectResult(cachedResult);
          return true;
      }

      return false;
    }

    retrieveCachedResult = () => {
        return array.head(this.state.results.filter(result => result.query === this.state.query));
    }
  
    getSavedResults() {
      try {
        let count = localStorage.getItem('results-count');
        let results = [];
  
        for (var i=0; i<count; i++) {
          let result = JSON.parse(localStorage.getItem(`result-${i}`));
          results.unshift(result);
        }
  
        this.setState({results});
      } catch (error) {
        console.error(error);
      }
    }
  
    saveResult = (data) => {
      try {
        localStorage.setItem(`result-${this.state.results.length - 1}`, JSON.stringify(data));
        localStorage.setItem(`results-count`, this.state.results.length);
      } catch(error) {
        console.error(error);
      }
    }
  
    selectResult = (result) => {

      this.setState({
        currentResult: result,
        query: result.query
      });

      this.props.updateGifs(result);
      this.toggleResults(false);
    }

    toggleResults = active => {
      this.setState(prevState => ({resultsActive: active}));
    }

    /* moveSelectedResult = direction => {
      if (direction === 'up') {
        this.setState(prevState => {currentResult: prevState.results});
      }
    } */

    handleKeyNavigation = event => {
      if (event.defaultPrevented) {
        return true;
      }

      const key = event.key || event.keyCode;
      if (key === 'ArrowUp' || key === '38') {
        this.moveSelectedResult('up');
      }

      if (key === 'ArrowDown' || key === '40') {
        this.moveSelectedResult('down');
      }

      return true;
    }

    render() {
        return (
            <header>
                <div className="search-container" onKeyDown={this.moveSelectedResult}>
                    <input className="search interactable" type="text" placeholder="search for gifs" onChange={this.handleInput} onFocus={() => this.toggleResults(true)} onBlur={() => this.toggleResults(false)} value={this.state.query}></input>
                    <Results active={this.state.resultsActive} results={this.state.results} selectResult={this.selectResult} current={this.state.currentResult} />
                </div>
                {this.state.limitMessage.length > 0 && (<div className="limit">{this.state.limitMessage}</div>)}
            </header>          
        )
    }
}



export default Search;