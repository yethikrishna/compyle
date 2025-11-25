const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

async function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    protocol.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function scrapeLusion() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  console.log('Navigating to lusion.co...');

  await page.goto('https://lusion.co/', {
    waitUntil: 'networkidle0',
    timeout: 60000
  });

  console.log('Waiting for page to fully render...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Get the HTML content
  console.log('Extracting HTML content...');
  const html = await page.content();

  // Get all resources (CSS, JS, images)
  console.log('Collecting resources...');
  const resources = await page.evaluate(() => {
    const resources = {
      styles: [],
      scripts: [],
      images: [],
      fonts: [],
      videos: []
    };

    // Collect stylesheets
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      resources.styles.push(link.href);
    });

    // Collect scripts
    document.querySelectorAll('script[src]').forEach(script => {
      resources.scripts.push(script.src);
    });

    // Collect images
    document.querySelectorAll('img[src]').forEach(img => {
      resources.images.push(img.src);
    });

    // Collect background images from computed styles
    document.querySelectorAll('*').forEach(el => {
      const bg = window.getComputedStyle(el).backgroundImage;
      if (bg && bg !== 'none') {
        const urlMatch = bg.match(/url\(['"]?([^'"]+)['"]?\)/);
        if (urlMatch && urlMatch[1]) {
          resources.images.push(urlMatch[1]);
        }
      }
    });

    // Collect videos
    document.querySelectorAll('video source[src], video[src]').forEach(video => {
      resources.videos.push(video.src);
    });

    return resources;
  });

  await browser.close();

  // Create directory structure
  const srcDir = path.join(__dirname, 'src');
  const assetsDir = path.join(srcDir, 'assets');
  const cssDir = path.join(assetsDir, 'css');
  const jsDir = path.join(assetsDir, 'js');
  const imagesDir = path.join(assetsDir, 'images');
  const videosDir = path.join(assetsDir, 'videos');

  [srcDir, assetsDir, cssDir, jsDir, imagesDir, videosDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  console.log('\nSaving HTML...');
  fs.writeFileSync(path.join(srcDir, 'index.html'), html);

  // Download resources
  console.log('\nDownloading resources...');

  // Download stylesheets
  console.log(`  Downloading ${resources.styles.length} stylesheets...`);
  for (let i = 0; i < resources.styles.length; i++) {
    try {
      const url = resources.styles[i];
      const filename = `style${i}.css`;
      await downloadFile(url, path.join(cssDir, filename));
      console.log(`    ✓ ${filename}`);
    } catch (err) {
      console.log(`    ✗ Failed: ${err.message}`);
    }
  }

  // Download scripts
  console.log(`  Downloading ${resources.scripts.length} scripts...`);
  for (let i = 0; i < resources.scripts.length; i++) {
    try {
      const url = resources.scripts[i];
      const filename = `script${i}.js`;
      await downloadFile(url, path.join(jsDir, filename));
      console.log(`    ✓ ${filename}`);
    } catch (err) {
      console.log(`    ✗ Failed: ${err.message}`);
    }
  }

  // Download images
  const uniqueImages = [...new Set(resources.images)];
  console.log(`  Downloading ${uniqueImages.length} unique images...`);
  for (let i = 0; i < Math.min(uniqueImages.length, 50); i++) { // Limit to 50 images for now
    try {
      const url = uniqueImages[i];
      const ext = path.extname(new URL(url).pathname) || '.jpg';
      const filename = `image${i}${ext}`;
      await downloadFile(url, path.join(imagesDir, filename));
      console.log(`    ✓ ${filename}`);
    } catch (err) {
      console.log(`    ✗ Failed: ${err.message}`);
    }
  }

  console.log('\n✓ Download complete!');
  console.log(`\nSummary:`);
  console.log(`  HTML: 1 file`);
  console.log(`  Styles: ${resources.styles.length} files`);
  console.log(`  Scripts: ${resources.scripts.length} files`);
  console.log(`  Images: ${Math.min(uniqueImages.length, 50)} files downloaded`);
  console.log(`\nFiles saved to: ./src/`);
}

scrapeLusion().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
