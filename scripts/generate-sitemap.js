import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream, readdirSync } from 'fs';
import { resolve } from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';

const pipelineAsync = promisify(pipeline);

// Example URLs
const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/blog/', changefreq: 'weekly', priority: 0.9 },
  { url: '/tags/', changefreq: 'weekly', priority: 0.9 },
  // Add more static URLs here
];

// Function to get blog post URLs
function getBlogPostLinks() {
  const blogDir = resolve('src/content/blog');
  const blogPosts = readdirSync(blogDir);
  return blogPosts.map(post => ({
    url: `/blog/${post.replace(/\.mdx?$/, '')}`,
    changefreq: 'monthly',
    priority: 0.7,
  }));
}

// Add blog post URLs to links
links.push(...getBlogPostLinks());

const sitemap = new SitemapStream({ hostname: 'https://shopperqueries.com' });

const writeStream = createWriteStream(resolve('public/sitemap.xml'));

async function generateSitemap() {
  try {
    links.forEach(link => sitemap.write(link));
    sitemap.end();

    await pipelineAsync(sitemap, writeStream);
    console.log('Sitemap created successfully');
  } catch (err) {
    console.error('Error creating sitemap:', err);
  }
}

generateSitemap();