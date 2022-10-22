const Pornsearch = require('pornsearch');
const Searcher = new Pornsearch('tits');

Searcher.videos()
    .then(videos => console.log(videos));
