import axios from 'axios';

export default class giphyapi {
    constructor(limit) {
        this.key = 'DQiCKhvwogMXAtMyn1DEXz7ZE5YFDuoz';
        this.host = 'https://api.giphy.com';
        this.limit = limit;
    }

    buildRequestURL(path, params) {
        return this.host + path + '?' + encodeQueryData({ 
            api_key: this.key, 
            ...params
        }); 
    }

    search(query) {
        let url = this.buildRequestURL('/v1/gifs/search', {
            q: query,
            limit: this.limit
        });

        return axios.get(url);        
    }

    random() {
        let url = this.buildRequestURL('/v1/gifs/random', {});

        return axios.get(url);
    }
}

function encodeQueryData(data) {
    const ret = [];
    for (let d in data)
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
 }