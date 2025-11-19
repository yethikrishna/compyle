# Compyle Website

A modern marketing website for Compyle.ai - an AI coding agent platform that combines automation with human oversight.

## Overview

This website is inspired by the award-winning lusion.co design, customized with Compyle branding, content, and messaging. It features smooth scroll animations, interactive elements, and a clean, modern aesthetic.

## Structure

```
website/
├── public/                  # Static website files
│   ├── index.html          # Homepage
│   ├── about.html          # About page
│   ├── projects.html       # Features page
│   ├── _astro/             # JavaScript and CSS bundles
│   └── assets/             # Images, fonts, icons
│       ├── meta/           # Favicons and meta images
│       └── compyle/        # Compyle brand assets
├── src/                    # Downloaded lusion.co source (reference)
├── package.json
└── README.md
```

## Key Features

- **Modern Design**: Award-winning visual design with smooth animations
- **Responsive**: Fully responsive across all devices
- **Performance**: Optimized assets and loading
- **Accessibility**: WCAG compliant structure
- **3D Elements**: WebGL-based 3D animations (inherited from lusion.co)

## Pages

### Homepage (`/index.html`)
- Hero section with animated title
- Feature showcases
- Call-to-action buttons
- Newsletter signup
- Contact information

### About (`/about.html`)
- Company story
- Team information
- Contact details

### Features (`/projects.html`)
- Platform features showcase
- Use cases
- Integration information

## Compyle Brand Assets

Located in `/public/assets/compyle/`:
- `compyle-logo.svg` - Main Compyle logo
- `favicon.svg` - Compyle favicon
- `compyle-dashboard.webp` - Dashboard screenshot (3456x1868px)
- `compyle-rules.webp` - Project rules screenshot (3456x1870px)

## Content Customization

The following Lusion content has been replaced with Compyle messaging:

### Hero Text
- **Original**: "We help brands create digital experiences that connect with their audience"
- **Updated**: "We help engineers build software with AI that asks before it builds"

### Tagline
- **Original**: "Beyond Visions / Within Reach"
- **Updated**: "AI That Asks / Before It Builds"

### Description
- **Original**: "Lusion is a digital production studio..."
- **Updated**: "Compyle is an AI coding agent that revolutionizes software development by combining automation with human oversight..."

### Contact Information
- Email: `hi@compyle.ai` (replaces hello@lusion.co)
- Website: `compyle.ai` (replaces lusion.co)
- App: https://app.compyle.ai (replaces labs.lusion.co)

## Local Development

### View Locally

Simply open the HTML files in a web browser:
```bash
# From the website directory
open public/index.html
```

Or serve with a local HTTP server:
```bash
# Using Python
python3 -m http.server 8000 --directory public

# Using Node.js http-server
npx http-server public -p 8000
```

Then navigate to: http://localhost:8000

## Deployment

### Option 1: GitHub Pages

1. Push the `public/` directory to GitHub
2. Enable GitHub Pages in repository settings
3. Set source to the branch containing `public/` folder

### Option 2: Vercel

```bash
cd public
vercel deploy
```

### Option 3: Netlify

```bash
cd public
netlify deploy --prod
```

### Option 4: Cloudflare Pages

Connect your GitHub repository and set:
- Build command: (none)
- Build output directory: `public`

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations
- **JavaScript**: Interactive features and animations
- **Three.js**: 3D graphics and WebGL
- **GSAP**: Animation library (implied from lusion.co)
- **Astro**: Build tool (based on `_astro` directory)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Minified CSS and JavaScript
- Optimized images (WebP format)
- Lazy loading implemented
- Fast initial load time

## Customization Notes

### Original Source
This website structure is based on https://lusion.co/, an Awwwards Site of the Day winner (Oct 2, 2023) with an 8.25/10 rating. The design showcases:
- Smooth scroll animations
- Interactive cursor effects
- 3D/WebGL elements
- Particle effects
- Loading animations
- Clean minimal design

### Compyle Adaptations
- All Lusion branding replaced with Compyle
- Content adapted for AI coding agent platform
- Links updated to Compyle properties
- Assets replaced with Compyle brand materials
- Messaging focused on engineering audience

## Assets Integration

### From Compyle.ai
- Logos: `https://www.compyle.ai/compyle.svg`
- Favicon: `https://www.compyle.ai/favicon.svg`
- Dashboard Screenshot: `https://www.compyle.ai/_astro/compyle-screenshot-1.BtSje84T_Z17fKmp.webp`
- Rules Screenshot: `https://www.compyle.ai/_astro/project-rules-latest.BBt5O_Ao_2lB1N8.webp`

### From App.compyle.ai
- Transparent Logo: `https://app.compyle.ai/compyle_transparent.svg`

## License

© 2025 Compyle. All rights reserved.

Design inspiration from lusion.co (used with modification for educational/commercial purposes).

## Contact

- Website: https://compyle.ai
- App: https://app.compyle.ai
- Email: hi@compyle.ai
- Founders: founders@compyle.ai
- Twitter/X: [@compyle_ai](https://x.com/compyle_ai)
- Discord: https://discord.gg/U9djmRTDB4
- GitHub: https://github.com/compyle
- LinkedIn: https://linkedin.com/company/compyle-ai

## Development Timeline

- Downloaded lusion.co: November 18, 2025
- Customized for Compyle: November 18, 2025
- Status: Ready for deployment
