import React, { Component } from 'react';
import fp from 'lodash/function';

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
        this.debouncedSearch();
      }
    
      handleSearchError = response => {
        let limitMessage = '';
    
        if (response.status === 429) {
          limitMessage = 'API requests per hour limit reached.'
        }
    
        this.setState(prevState => ({
          errors: prevState.errors.concat(response.data),
          limitMessage: limitMessage
        }));
        console.error('Error:', response.data);
      }
    
      handleSearchSuccess = response => {
        let result = {query: this.state.query, data: response.data.data};
    
        this.setState(prevState => ({
          currentResult: result,
          results: [result].concat(prevState.results)
        }));

        this.props.updateGifs(result);
    
        this.saveResult(result);
        console.log('Search Response:', performance.now(), response.data);
      }
    
      populateSearch = () => {
        if (this.state.query === '') {
          return;
        }
    
        this.giphy.search(this.state.query)
          .then(response => {
            if (response.status !== 200) {
              this.handleSearchError(response);
            } else {
              this.handleSearchSuccess(response);
            }
          })
          .catch(error => console.error('Error:', error));
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
        this.toggleResults();
      }
    
      selectedResultClass = (result) => {
        return result == this.state.currentResult ? 'result result-selected' : 'result';
      }

      toggleResults = () => {
        this.setState(prevState => ({resultsActive: !prevState.resultsActive}));
      }

      getResultsClass = () => this.state.resultsActive ? 'results-container show' : 'results-container';


    render() {
        return (
            <div className="search-container">
                <input className="search interactable" type="text" placeholder="search for gifs" onChange={this.handleInput} value={this.state.query} onFocus={this.toggleResults}></input>
                <ul className={this.getResultsClass()}>
                    {this.state.results.map((result, index) => (
                    <li key={index} className={this.selectedResultClass(result)} onClick={() => this.selectResult(result)}>{result.query}</li>
                    ))}
                </ul>
            </div>           
        )
    }
}



export default Search;