import React, { Component } from 'react';
import fp from 'lodash/function';
import array from 'lodash/array';
import Results from '../Results/Results';
import ResultsCache from '../results-cache';

import './search.css';

class Search extends Component {
    constructor(props) {
        super(props);

        this.cache = new ResultsCache();
        this.state = {
            errors: [],
            results: this.cache.getSavedResults(),
            currentResult: [],
            selectedResult: null,
            resultsActive: false,
            query: '',
            limitMessage: '',
        }

        this.giphy = props.giphy;
        this.debouncedSearch = fp.debounce(this.populateSearch, 500);
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
      let result = {query: this.state.query, data: this.cache.refineData(response.data.data)};
  
      this.setState(prevState => ({
        currentResult: result,
        results: [result].concat(prevState.results),
        limitMessage: ''
      }));

      this.props.updateGifs(result);
      this.toggleResults(false);
      this.cache.saveResult(result);
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

    previousResult(index) {
      if (index <= 0) {
        this.setState({selectedResult: array.tail(this.state.results)[0]})
      } else {
        this.setState({selectedResult: this.state.results[index - 1]})
      }
    }

    nextResult(index) {
      if (index >= this.state.results.length - 1) {
        this.setState({selectedResult: array.head(this.state.results)[0]})
      } else {
        this.setState({selectedResult: this.state.results[index + 1]})
      }
    }

    moveSelectedResult = direction => {
      let index = this.state.results.indexOf(this.state.selectedResult);
      this.toggleResults(true);
      
      if (direction === 'up') {
        this.previousResult(index);
      }

      if (direction === 'down') {
        this.nextResult(index);
      }
    }

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

      if (key === 'Enter' || key === '13') {
        this.selectResult(this.state.selectedResult)
      }

      return true;
    }

    render() {
        return (
            <header>
                <div className="search-container" onKeyDown={this.handleKeyNavigation}>
                    <input className="search interactable" type="text" placeholder="search for gifs" onChange={this.handleInput} onFocus={() => this.toggleResults(true)} onBlur={() => this.toggleResults(false)} value={this.state.query}></input>
                    <Results active={this.state.resultsActive} results={this.state.results} selectResult={this.selectResult} current={this.state.currentResult} selectedResult={this.state.selectedResult} />
                </div>
                {this.state.limitMessage.length > 0 && (<div className="limit">{this.state.limitMessage}</div>)}
            </header>          
        )
    }
}



export default Search;