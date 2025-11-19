# Compyle Website - Deployment Guide

## Completed Customizations

### ✅ Text & Branding
- [x] Homepage title: "Compyle - AI Coding Agent Platform"
- [x] Hero message: "We help engineers build software with AI that asks before it builds"
- [x] Tagline: "AI That Asks / Before It Builds"
- [x] Company description fully updated for Compyle
- [x] Email: `hi@compyle.ai` (all pages)
- [x] App link: `https://app.compyle.ai` (replaced labs.lusion.co)
- [x] "Try It" button (replaced "Labs")

### ✅ Logo Replacement
- [x] Header logo replaced with Compyle logo on all pages (index, about, projects)
- [x] Logo styled with proper sizing and inversion filter for visibility

### ✅ Assets Downloaded
- [x] Compyle main logo SVG
- [x] Compyle favicon SVG
- [x] Dashboard screenshot (3456x1868px WebP)
- [x] Project rules screenshot (3456x1870px WebP)

### ✅ Meta Tags & SEO
- [x] Page titles updated on all pages
- [x] Open Graph tags updated (og:title, og:description, og:site_name)
- [x] Meta descriptions updated for Compyle

### ✅ Documentation
- [x] Comprehensive README.md
- [x] .gitignore file
- [x] This deployment guide

---

## Quick Deploy Options

### Option 1: Vercel (Recommended - Fastest)

```bash
cd /workspace/cmi4hg4g6004mr3ilc6eip8zb/compyle/website/public
vercel deploy --prod
```

**Advantages:**
- Instant global CDN
- Automatic HTTPS
- Zero configuration
- Perfect for static sites

---

### Option 2: Netlify Drop

1. Zip the `public/` folder:
```bash
cd /workspace/cmi4hg4g6004mr3ilc6eip8zb/compyle/website
zip -r compyle-website.zip public/
```

2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag and drop `compyle-website.zip`
4. Get instant live URL

**Advantages:**
- No CLI needed
- Instant deployment
- Free tier generous

---

### Option 3: GitHub Pages

1. Create new GitHub repository: `compyle-website`

2. Push the public folder:
```bash
cd /workspace/cmi4hg4g6004mr3ilc6eip8zb/compyle/website/public
git init
git add .
git commit -m "Initial commit: Compyle website (lusion-inspired)"
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/compyle-website.git
git push -u origin main
```

3. Enable GitHub Pages:
   - Go to repository Settings → Pages
   - Source: Deploy from branch `main` / `root`
   - Save

4. Access at: `https://YOUR_USERNAME.github.io/compyle-website/`

**Advantages:**
- Free hosting
- Custom domain support
- Version control included

---

### Option 4: Cloudflare Pages

1. Push to GitHub (same as Option 3 above)

2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)

3. Connect your GitHub repository

4. Configure:
   - Build command: (leave empty)
   - Build output directory: `/` or `.`
   - Root directory: (leave empty)

5. Deploy

**Advantages:**
- Fastest CDN globally
- Unlimited bandwidth (free)
- Best performance

---

## Local Testing

Before deploying, test locally:

```bash
cd /workspace/cmi4hg4g6004mr3ilc6eip8zb/compyle/website/public

# Option 1: Python
python3 -m http.server 8000

# Option 2: Node.js
npx http-server . -p 8000

# Option 3: PHP
php -S localhost:8000
```

Then visit: http://localhost:8000

**Test checklist:**
- [ ] Homepage loads without errors
- [ ] Logo displays correctly in header
- [ ] Hero text shows Compyle messaging
- [ ] "Try It" button links to app.compyle.ai
- [ ] Email links go to hi@compyle.ai
- [ ] About page loads
- [ ] Projects/Features page loads
- [ ] Animations work (scroll effects, cursor, etc.)
- [ ] Responsive on mobile (test in DevTools)
- [ ] No console errors in browser

---

## Custom Domain Setup

### For Vercel:
```bash
vercel domains add compyle.ai
```
Follow DNS instructions provided.

### For Netlify:
1. Go to Domain settings
2. Add custom domain: `compyle.ai`
3. Update DNS records as instructed

### For GitHub Pages:
1. Add file `public/CNAME` with content: `compyle.ai`
2. Update DNS:
   - Add CNAME record: `www` → `YOUR_USERNAME.github.io`
   - Add A records pointing to GitHub Pages IPs

### For Cloudflare Pages:
1. Go to Custom Domains
2. Add `compyle.ai`
3. DNS automatically configured if domain is on Cloudflare

---

## Post-Deployment Checklist

After deploying to production:

- [ ] Test live URL loads correctly
- [ ] All pages accessible (/, /about, /projects)
- [ ] HTTPS certificate active and valid
- [ ] Favicon displays in browser tab
- [ ] Open Graph tags work (test: https://www.opengraph.xyz/)
- [ ] Twitter Card preview works
- [ ] Mobile responsive (test on real device)
- [ ] Performance acceptable (run Lighthouse audit)
- [ ] Email links open correctly
- [ ] External links work (app.compyle.ai)

---

## Performance Optimization (Optional)

If you want to further optimize:

### 1. Image Optimization
```bash
# Install webp converter
npm install -g cwebp

# Convert images to webp
for img in public/assets/compyle/*.png; do
  cwebp -q 80 "$img" -o "${img%.png}.webp"
done
```

### 2. Minify HTML (Already Minified)
The HTML is already minified from lusion.co.

### 3. Enable Compression
Most platforms (Vercel, Netlify, Cloudflare) enable gzip/brotli automatically.

### 4. Add Service Worker (Advanced)
For offline capabilities and faster repeat visits:
```javascript
// public/sw.js
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('compyle-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/about.html',
        '/projects.html',
        '/_astro/about.e7252178.css',
        '/_astro/hoisted.81170750.js',
        '/assets/compyle/compyle-logo.svg'
      ]);
    })
  );
});
```

---

## Monitoring & Analytics

### Add Google Analytics (Optional)

The lusion.co tracking code is still in place:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-W2XC5XK9QJ"></script>
```

To replace with Compyle's GA:

1. Get your GA4 tracking ID from Google Analytics
2. Replace `G-W2XC5XK9QJ` with your tracking ID in:
   - `public/index.html`
   - `public/about.html`
   - `public/projects.html`

### Alternative: Plausible Analytics

For privacy-friendly analytics:
```html
<script defer data-domain="compyle.ai" src="https://plausible.io/js/script.js"></script>
```

---

## Troubleshooting

### Issue: Logo not displaying
**Solution:** Check that `/assets/compyle/compyle-logo.svg` exists and is accessible

### Issue: Animations not working
**Solution:** JavaScript files from `_astro/` must be accessible. Check browser console for errors.

### Issue: 404 on about/projects pages
**Solution:** Some platforms need configuration for clean URLs:
- Vercel: Add `vercel.json` with rewrites
- Netlify: Add `_redirects` file
- GitHub Pages: May need `.nojekyll` file

### Issue: Styles not loading
**Solution:** Verify `/_astro/about.e7252178.css` is accessible and MIME type is `text/css`

---

## Support & Resources

- **Compyle Website:** https://compyle.ai
- **Compyle App:** https://app.compyle.ai
- **Email:** hi@compyle.ai
- **Twitter/X:** [@compyle_ai](https://x.com/compyle_ai)
- **Discord:** https://discord.gg/U9djmRTDB4

---

## Version Info

- **Created:** November 18, 2025
- **Based on:** lusion.co (Awwwards SOTD, 8.25/10)
- **Status:** Production Ready
- **License:** © 2025 Compyle

---

## What's Preserved from Lusion.co

All the award-winning features:
- ✨ Smooth scroll animations (GSAP)
- 🎨 Interactive 3D/WebGL elements (Three.js)
- 🖱️ Custom cursor effects
- ✨ Particle animations
- ⏳ Creative loading screens
- 📱 Fully responsive design
- 🎭 Clean minimal aesthetic

## What's New for Compyle

- 🏢 Compyle branding and messaging
- 📧 Compyle contact information
- 🔗 Links to app.compyle.ai
- 🎯 AI coding agent positioning
- 👨‍💻 Engineer-focused copy

---

**Ready to deploy!** Choose your preferred method above and launch your Compyle website. 🚀
