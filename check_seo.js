const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');
const { JSDOM } = require('jsdom');
const dom = new JSDOM(html);
const doc = dom.window.document;

const title = doc.querySelector('title');
console.log('Title:', title ? title.textContent : 'Missing');

const description = doc.querySelector('meta[name="description"]');
console.log('Description:', description ? description.getAttribute('content') : 'Missing');

const ogTitle = doc.querySelector('meta[property="og:title"]');
console.log('og:title:', ogTitle ? ogTitle.getAttribute('content') : 'Missing');

const ogDesc = doc.querySelector('meta[property="og:description"]');
console.log('og:description:', ogDesc ? ogDesc.getAttribute('content') : 'Missing');

const twitterTitle = doc.querySelector('meta[name="twitter:title"]');
console.log('twitter:title:', twitterTitle ? twitterTitle.getAttribute('content') : 'Missing');

const twitterDesc = doc.querySelector('meta[name="twitter:description"]');
console.log('twitter:description:', twitterDesc ? twitterDesc.getAttribute('content') : 'Missing');
