import React, { Component } from 'react';
import fp from 'lodash/function';
import array from 'lodash/array';

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

      moveSelectedResult = event => {

      }

      selectedResultClass = result => result === this.state.currentResult ? 'result result-selected' : 'result';

      getResultsClass = () => this.state.resultsActive ? 'results-container show' : 'results-container';


    render() {
        return (
            <header>
                <div className="search-container" onKeyDown={this.moveSelectedResult}>
                    <input className="search interactable" type="text" placeholder="search for gifs" onChange={this.handleInput} onFocus={() => this.toggleResults(true)} onBlur={() => this.toggleResults(false)} value={this.state.query}></input>
                    <ul className={this.getResultsClass()}>
                        {this.state.results.map((result, index) => (
                        <li key={index} className={this.selectedResultClass(result)} onMouseDown={() => this.selectResult(result)} tabIndex="1">{result.query}</li>
                        ))}
                    </ul>
                </div>
                {this.state.limitMessage.length > 0 && (<div className="limit">{this.state.limitMessage}</div>)}
            </header>          
        )
    }
}



export default Search;