class ResultsCache {
	refineImageObject(image) {
		return {
			width: image.width,
			height: image.height,
			url: image.mp4,
			size: image.mp4_size
		}
	}

	refineData(data) {
		return data.map(result => ({
			title: result.title,
			url: result.bitly_url,
			preview: this.refineImageObject(result.images.preview),
			original: this.refineImageObject(result.images.original)
		}));
	}

	getSavedResults() {
		try {
			let count = localStorage.getItem('results-count') || 0;
			let results = [];

			for (var i = 0; i < count; i++) {
				let result = JSON.parse(localStorage.getItem(`result-${i}`));
				results.unshift(result);
			}

			return results;
		} catch (error) {
			console.error(error);
		}
	}

	saveResult = (data, results) => {
		try {
			localStorage.setItem(`result-${results.length - 1}`, JSON.stringify(data));
			localStorage.setItem(`results-count`, results.length);
		} catch (error) {
			console.error(error);
		}
	}
}

export default ResultsCache;