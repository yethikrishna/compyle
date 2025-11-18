const scrape = require('website-scraper');
const PuppeteerPlugin = require('website-scraper-puppeteer');

const options = {
  urls: ['https://lusion.co/'],
  directory: './src',
  recursive: true,
  maxRecursiveDepth: 10,
  prettifyUrls: true,
  filenameGenerator: 'bySiteStructure',
  requestConcurrency: 3,
  plugins: [
    new PuppeteerPlugin({
      launchOptions: {
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      },
      scrollToBottom: {
        timeout: 10000,
        viewportN: 10
      },
      blockNavigation: true,
      timeout: 60000
    })
  ],
  sources: [
    { selector: 'img', attr: 'src' },
    { selector: 'img', attr: 'srcset' },
    { selector: 'link[rel="stylesheet"]', attr: 'href' },
    { selector: 'link[rel="icon"]', attr: 'href' },
    { selector: 'link[rel="apple-touch-icon"]', attr: 'href' },
    { selector: 'script', attr: 'src' },
    { selector: 'video', attr: 'src' },
    { selector: 'video source', attr: 'src' },
    { selector: 'audio', attr: 'src' },
    { selector: 'source', attr: 'src' }
  ],
  urlFilter: (url) => {
    // Only download from lusion.co domain
    return url.includes('lusion.co') || url.startsWith('/');
  }
};

console.log('Starting lusion.co website download...');
console.log('This may take several minutes...\n');

scrape(options)
  .then(() => {
    console.log('\n✓ Download completed successfully!');
    console.log('Files saved to: ./src/');
  })
  .catch((err) => {
    console.error('✗ Download failed:', err);
    process.exit(1);
  });
