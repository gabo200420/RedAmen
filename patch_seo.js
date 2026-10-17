const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Insert new meta tags before Open Graph / Facebook comment or at an appropriate place
const insertStr = `  <!-- Open Graph / Facebook -->
  <meta property="og:url" content="https://redameninmuebles.com/">
  <meta property="og:image" content="https://redameninmuebles.com/assets/portada/logo.png">`;

html = html.replace('  <!-- Open Graph / Facebook -->', insertStr);

const insertTwitterStr = `  <!-- Twitter Cards -->
  <meta name="twitter:image" content="https://redameninmuebles.com/assets/portada/logo.png">`;

html = html.replace('  <!-- Twitter Cards -->', insertTwitterStr);

fs.writeFileSync('index.html', html);
