import React, { Component } from "react";
import './gif.css';

class Gif extends Component {

	copyGIF = (gif) => {
		var text = gif.bitly_url;
		navigator.clipboard.writeText(text).then(function () {
			console.log('Async: Copying to clipboard was successful!');
		}, function (err) {
			console.error('Async: Could not copy text: ', err);
		});
	}

	render() {
		const { gif, moveGif } = this.props;
		const hasGif = gif === null;
		return (
			<div className="gif-container">
				{gif && (
					<video className="gif" autoPlay playsInline loop preload="auto" src={gif.images.preview.mp4}></video>
				)}
				<div className="controls">
					<button className="interactable interactable-hover" disabled={hasGif} onClick={() => moveGif(-1)}>&laquo;&nbsp;Previous</button>
					<button className="interactable interactable-hover" disabled={gif === null} onClick={() => moveGif(1)}>Next&nbsp;&raquo;</button>
					<button className="interactable interactable-hover" disabled={gif === null} onClick={() => this.copyGIF(gif)}>Copy</button>
				</div>
			</div>
		)
	}
}

export default Gif;