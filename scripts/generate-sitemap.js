const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const { resolve } = require('path');

// Example URLs
const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  // Add more URLs here
];

const sitemap = new SitemapStream({ hostname: 'https://shopperqueries.com' });

streamToPromise(sitemap.pipe(createWriteStream(resolve(__dirname, '../public/sitemap.xml'))))
  .then(() => console.log('Sitemap created successfully'))
  .catch((err) => console.error('Error creating sitemap:', err));

links.forEach(link => sitemap.write(link));
sitemap.end();