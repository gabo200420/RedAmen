const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');
const { JSDOM } = require('jsdom');
const dom = new JSDOM(html);
const imgs = dom.window.document.querySelectorAll('img');

imgs.forEach(img => {
  const alt = img.getAttribute('alt');
  const loading = img.getAttribute('loading');
  const src = img.getAttribute('src');

  if (alt === null || alt === '') {
    console.log(`Image missing alt: ${src}`);
  }
  if (loading !== 'lazy') {
    console.log(`Image missing loading="lazy": ${src}`);
  }
});
