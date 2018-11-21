import React from 'react';
import './results.css';

function Results({ results, current, active, selectResult, selectedResult}) {
	const selectedResultClass = result => {
		let resultClass = 'result ';
		if (result === current) {
			resultClass = 'result result-current';
		}
		if (result === selectedResult) {
			resultClass = 'result result-selected';
		}

		return resultClass;
	}

	const resultsClass = active ? 'results-container show' : 'results-container';

	return (
		<ul className={resultsClass}>
			{results.map((result, index) => (
				<li key={index} className={selectedResultClass(result)} onMouseDown={() => selectResult(result)} tabIndex="1">{result.query}</li>
			))}
		</ul>
	)
}

export default Results;