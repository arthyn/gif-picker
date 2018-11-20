import React from 'react';
import './results.css';

function Results({ results, current, active, selectResult}) {
	const selectedResultClass = result => result === current ? 'result result-selected' : 'result';

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