# Asset Acquisition Checklist for Compyle Documentation

## Purpose
This checklist ensures all visual assets are properly sourced, formatted, and integrated into the documentation. Use this as a step-by-step guide to complete the remaining 33% of the documentation enhancement.

---

## 📋 Phase 7: Team Member Photos

### Acquisition Tasks

- [ ] **Jonathan Miranda (CEO)**
  - [ ] Source professional headshot from LinkedIn or directly
  - [ ] Confirm permission to use publicly
  - [ ] Save original high-resolution version
  - [ ] Crop to 400x400px square (centered on face)
  - [ ] Optimize to < 200KB (use TinyPNG or ImageOptim)
  - [ ] Convert to WebP format (preferred) or PNG
  - [ ] Save as `/images/team/jonathan-miranda.webp`
  - [ ] Verify file size and quality

- [ ] **Mark Nazzaro (CTO)**
  - [ ] Source professional headshot from LinkedIn or directly
  - [ ] Confirm permission to use publicly
  - [ ] Save original high-resolution version
  - [ ] Crop to 400x400px square (centered on face)
  - [ ] Optimize to < 200KB
  - [ ] Convert to WebP format (preferred) or PNG
  - [ ] Save as `/images/team/mark-nazzaro.webp`
  - [ ] Verify file size and quality

- [ ] **Yethikrishna R (Documentation Lead)**
  - [ ] Request professional headshot directly
  - [ ] Confirm permission to use publicly
  - [ ] Save original high-resolution version
  - [ ] Crop to 400x400px square (centered on face)
  - [ ] Optimize to < 200KB
  - [ ] Convert to WebP format (preferred) or PNG
  - [ ] Save as `/images/team/yethikrishna-r.webp`
  - [ ] Verify file size and quality

### Integration Tasks

- [ ] Open `about.mdx` in editor
- [ ] Find TODO comment at line 92 (Jonathan section)
- [ ] Uncomment the `<div>` and `<img>` tags (remove `{/*` and `*/}`)
- [ ] Find TODO comment at line 115 (Mark section)
- [ ] Uncomment the `<div>` and `<img>` tags
- [ ] Find TODO comment at line 310 (Yethikrishna section)
- [ ] Uncomment the `<div>` and `<img>` tags
- [ ] Save file
- [ ] Preview locally with `mintlify dev` (if available)
- [ ] Verify photos display correctly in light and dark mode
- [ ] Check responsive layout on mobile sizes
- [ ] Commit and deploy

**Estimated Time:** 30 minutes total once photos are obtained
**Priority:** HIGH - adds credibility and personal connection

---

## 📸 Phase 8: Product Screenshots

### Acquisition Tasks

- [ ] **Dashboard Overview** (`dashboard-overview.png`)
  - [ ] Log into https://app.compyle.ai
  - [ ] Navigate to main dashboard
  - [ ] Ensure clean state (no personal data, errors, or notifications visible)
  - [ ] Take screenshot at 1920x1080 or higher resolution
  - [ ] Crop to 1200x800px showing key UI elements
  - [ ] Optimize to < 500KB
  - [ ] Convert to WebP (preferred) or PNG
  - [ ] Save as `/images/screenshots/dashboard-overview.png`
  - [ ] Verify clarity and readability

- [ ] **Agent Workflow Phases** (`agent-workflow-phases.png`)
  - [ ] Open or create a task showing all 3 phases
  - [ ] Capture interface with research, planning, implementation tabs visible
  - [ ] Ensure screenshot shows collaborative nature
  - [ ] Crop to 1200x800px
  - [ ] Optimize to < 500KB
  - [ ] Convert to WebP or PNG
  - [ ] Save as `/images/screenshots/agent-workflow-phases.png`
  - [ ] Verify all phase labels are readable

- [ ] **Validation UI** (`validation-ui.png`)
  - [ ] Capture screen during implementation with validation checks visible
  - [ ] Show validation passing or interesting validation question
  - [ ] Crop to 1200x800px
  - [ ] Optimize to < 500KB
  - [ ] Convert to WebP or PNG
  - [ ] Save as `/images/screenshots/validation-ui.png`
  - [ ] Verify validation messages are legible

- [ ] **Custom Rules Configuration** (`custom-rules-config.png`)
  - [ ] Navigate to project settings → Custom Rules
  - [ ] Ensure 2-3 example rules are visible
  - [ ] Capture rules configuration interface
  - [ ] Crop to 1200x800px
  - [ ] Optimize to < 500KB
  - [ ] Convert to WebP or PNG
  - [ ] Save as `/images/screenshots/custom-rules-config.png`
  - [ ] Verify rule details are readable

- [ ] **Command Palette** (`command-palette.png`)
  - [ ] Press Cmd+K (Mac) or Ctrl+K (Windows/Linux) to open palette
  - [ ] Type a search query to show results
  - [ ] Capture overlay with search and commands visible
  - [ ] Crop to 1200x800px
  - [ ] Optimize to < 500KB
  - [ ] Convert to WebP or PNG
  - [ ] Save as `/images/screenshots/command-palette.png`
  - [ ] Verify text is crisp and readable

### Integration Tasks

- [ ] **Dashboard screenshot** (`features/overview.mdx`)
  - [ ] Open `features/overview.mdx`
  - [ ] Find TODO comment at line 25
  - [ ] Uncomment the image block
  - [ ] Save and verify

- [ ] **Workflow phases screenshot** (`getting-started/agent-workflow-intro.mdx`)
  - [ ] Open `getting-started/agent-workflow-intro.mdx`
  - [ ] Find TODO comment at line 19
  - [ ] Uncomment the image block
  - [ ] Save and verify

- [ ] **Validation UI screenshot** (`features/code-review.mdx`)
  - [ ] Open `features/code-review.mdx`
  - [ ] Find TODO comment at line 36
  - [ ] Uncomment the image block
  - [ ] Save and verify

- [ ] **Custom rules screenshot** (`features/custom-rules.mdx`)
  - [ ] Open `features/custom-rules.mdx`
  - [ ] Find TODO comment at line 69
  - [ ] Uncomment the image block
  - [ ] Save and verify

- [ ] **Command palette screenshot** (`features/command-palette.mdx`)
  - [ ] Open `features/command-palette.mdx`
  - [ ] Find TODO comment at line 20
  - [ ] Uncomment the image block
  - [ ] Save and verify

- [ ] Final verification
  - [ ] Preview all pages with screenshots
  - [ ] Check alt text is descriptive
  - [ ] Verify images load in both light/dark mode
  - [ ] Test responsive behavior
  - [ ] Commit and deploy

**Estimated Time:** 1-2 hours (30 min capture + 30 min optimization + 30 min integration)
**Priority:** HIGH - shows actual product, reduces uncertainty

---

## 💬 Phase 9: User Testimonials

### Acquisition Tasks

- [ ] **Identify 3-5 Active Users**
  - [ ] Review recent users with significant Compyle usage
  - [ ] Check Discord community for engaged users
  - [ ] Review users who gave positive feedback
  - [ ] Select diverse use cases (solo dev, team, enterprise, freelance)

- [ ] **Outreach (per user)**
  - [ ] Send testimonial request email (template in `/images/testimonials/SAMPLE-TESTIMONIALS.md`)
  - [ ] Include clear requirements: quote, metrics, photo, permission
  - [ ] Offer to help with phrasing if needed
  - [ ] Set deadline (1-2 weeks)

- [ ] **Testimonial 1**
  - [ ] Receive quote (2-4 sentences, 150-300 characters)
  - [ ] Receive headshot photo
  - [ ] Confirm name, role, company
  - [ ] Get explicit permission for public use
  - [ ] Optimize photo to 200x200px, < 100KB
  - [ ] Save as `/images/testimonials/[firstname-lastname].webp`

- [ ] **Testimonial 2**
  - [ ] Same process as Testimonial 1

- [ ] **Testimonial 3**
  - [ ] Same process as Testimonial 1

- [ ] **Testimonial 4 (optional)**
  - [ ] Same process as Testimonial 1

- [ ] **Testimonial 5 (optional)**
  - [ ] Same process as Testimonial 1

### Integration Tasks

- [ ] Open `about.mdx` in editor
- [ ] Find TODO comment at line 188
- [ ] Uncomment the CardGroup block (lines 188-234)
- [ ] Replace placeholder content with real testimonials:
  - [ ] User 1: name, role, company, quote, photo path
  - [ ] User 2: name, role, company, quote, photo path
  - [ ] User 3: name, role, company, quote, photo path
  - [ ] User 4 (if available): same process
- [ ] Remove the Note callout (lines 184-186) inviting submissions
- [ ] Save file
- [ ] Preview locally
- [ ] Verify all photos display correctly
- [ ] Check quote formatting and length
- [ ] Verify attribution accuracy
- [ ] Commit and deploy

**Estimated Time:** 1-2 weeks for collection + 30 min integration
**Priority:** MEDIUM - builds social proof and trust

---

## 🎥 Phase 10: Video Tutorials

### Video Creation Tasks

- [ ] **Video 1: Creating Your First Task** (6 minutes, Beginner)
  - [ ] Write script covering task creation workflow
  - [ ] Record screen capture with voiceover
  - [ ] Edit for clarity (cut pauses, mistakes)
  - [ ] Add intro/outro with Compyle branding
  - [ ] Export at 1080p quality
  - [ ] Upload to YouTube
  - [ ] Set title, description, tags for SEO
  - [ ] Add to Compyle playlist
  - [ ] Copy YouTube URL

- [ ] **Video 2: Understanding 3-Phase Workflow** (9 minutes, Beginner)
  - [ ] Write script explaining research, planning, implementation
  - [ ] Record screen capture showing each phase
  - [ ] Edit with annotations highlighting key concepts
  - [ ] Export and upload to YouTube
  - [ ] Copy YouTube URL

- [ ] **Video 3: Answering Planning Questions** (5 minutes, Intermediate)
  - [ ] Write script on effective question answering
  - [ ] Record examples of good vs. mediocre answers
  - [ ] Edit with side-by-side comparisons
  - [ ] Export and upload to YouTube
  - [ ] Copy YouTube URL

- [ ] **Video 4: Code Review & Validation** (8 minutes, Intermediate)
  - [ ] Write script covering validation system
  - [ ] Record real validation scenarios
  - [ ] Edit showing different validation outcomes
  - [ ] Export and upload to YouTube
  - [ ] Copy YouTube URL

- [ ] **Video 5: Setting Up Custom Rules** (7 minutes, Advanced)
  - [ ] Write script on custom rule configuration
  - [ ] Record rule creation with examples
  - [ ] Edit showing before/after validation
  - [ ] Export and upload to YouTube
  - [ ] Copy YouTube URL

- [ ] **Video 6: Command Palette Mastery** (4 minutes, All Levels)
  - [ ] Write script on keyboard shortcuts and workflow
  - [ ] Record quick command palette navigation
  - [ ] Edit with overlay showing keyboard shortcuts
  - [ ] Export and upload to YouTube
  - [ ] Copy YouTube URL

### Thumbnail Creation Tasks

- [ ] **Create 6 branded thumbnails** (1280x720px each)
  - [ ] Use Figma, Canva, or Photoshop
  - [ ] Include Compyle logo/branding
  - [ ] Add video title text (large, readable)
  - [ ] Use brand colors: #0F766E (primary), #F3F4F6 (light), #001F1A (dark)
  - [ ] Add duration and difficulty level badges
  - [ ] Ensure text readable at small sizes
  - [ ] Export as PNG, optimize to < 200KB each
  - [ ] Save to `/images/video-thumbnails/`
    - `creating-first-task.png`
    - `understanding-workflow.png`
    - `answering-planning-questions.png`
    - `code-review-validation.png`
    - `setting-up-custom-rules.png`
    - `command-palette-mastery.png`

### Integration Tasks

- [ ] Open `community.mdx` in editor
- [ ] Find TODO comment at line 210
- [ ] Uncomment the CardGroup block (lines 210-248)
- [ ] Replace `[YOUTUBE_URL]` placeholders with actual URLs:
  - [ ] Video 1 URL
  - [ ] Video 2 URL
  - [ ] Video 3 URL
  - [ ] Video 4 URL
  - [ ] Video 5 URL
  - [ ] Video 6 URL
- [ ] Update Note callout (line 250-252) or remove if videos are complete
- [ ] Save file
- [ ] Preview locally
- [ ] Verify all video links work
- [ ] Check card layout and descriptions
- [ ] Commit and deploy

**Estimated Time:** 2-3 weeks for video production + 30 min integration
**Priority:** MEDIUM - valuable learning resource

---

## 🎨 Phase 11: Additional Diagrams (Optional)

### Diagram Creation Tasks

- [ ] **Collaborative Approach Diagram** ✅ COMPLETE
  - Already created as `/images/diagrams/collaborative-approach.svg`
  - Already integrated into `features/overview.mdx`

- [ ] **Additional Diagrams (optional future work)**
  - [ ] Integration architecture diagram
  - [ ] Data flow visualization
  - [ ] Security model diagram
  - [ ] Team collaboration workflow

**Priority:** LOW - core diagram already complete

---

## ✅ Final Verification Checklist

### Pre-Deployment

- [ ] All image files added to `/images/` subdirectories
- [ ] All file sizes meet requirements (< specified limits)
- [ ] All images optimized for web (WebP preferred)
- [ ] All TODO comments uncommented where assets added
- [ ] All placeholder text replaced with actual content
- [ ] All file paths correct and images load locally
- [ ] Alt text present and descriptive on all images
- [ ] No broken links or 404 errors
- [ ] Light mode display verified
- [ ] Dark mode display verified
- [ ] Mobile responsive layout tested
- [ ] Desktop layout tested
- [ ] Preview with `mintlify dev` successful
- [ ] No build errors or warnings

### Post-Deployment

- [ ] Visit production site (compyle.mintlify.app)
- [ ] Verify all team photos display correctly
- [ ] Verify all product screenshots visible
- [ ] Verify testimonials formatted correctly (if added)
- [ ] Verify video links work (if added)
- [ ] Verify diagram displays correctly
- [ ] Test all navigation links
- [ ] Check page load times
- [ ] Verify responsive behavior on mobile device
- [ ] Check browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Verify WCAG accessibility standards met
- [ ] Check analytics for 404 errors
- [ ] Monitor user feedback

---

## 📊 Progress Tracking

### Current Status

**Phase 1-6:** ✅ COMPLETE (67% overall)
- Social media link standardization ✅
- Mermaid workflow diagram ✅
- Pattern Library page ✅
- Navigation updates ✅
- Image directory infrastructure ✅
- Placeholder structures ✅

**Phase 7-11:** ⏳ PENDING ASSETS (33% remaining)
- Team photos: 0/3 complete
- Product screenshots: 0/5 complete
- Testimonials: 0/3-5 complete
- Video tutorials: 0/6 complete
- Additional diagrams: 1/1 complete ✅

### Time Estimates

| Phase | Acquisition Time | Integration Time | Total |
|-------|------------------|------------------|-------|
| Team Photos | 1-3 days | 10 min | ~3 days |
| Screenshots | 30 min | 15 min | ~45 min |
| Testimonials | 1-2 weeks | 30 min | ~2 weeks |
| Videos | 2-3 weeks | 15 min | ~3 weeks |
| **TOTAL** | **~4-5 weeks** | **~1-2 hours** | **~5 weeks** |

### Completion Path

**Week 1:**
- Source and add team photos ✅
- Capture and add product screenshots ✅
- Update documentation with both

**Week 2-3:**
- Collect user testimonials
- Create video tutorial scripts
- Begin video production

**Week 4-5:**
- Complete video production
- Add testimonials to site
- Add video links to site
- Final verification

---

## 📞 Contact & Resources

**For asset acquisition questions:**
- Email: hi@compyle.ai
- Documentation team: Yethikrishna R

**Useful tools:**
- Image optimization: TinyPNG, ImageOptim, Squoosh
- Screenshot capture: CleanShot, Snagit, built-in OS tools
- Video editing: Descript, Camtasia, Final Cut Pro, Adobe Premiere
- Design: Figma, Canva, Adobe Creative Suite
- Format conversion: CloudConvert, Online-Convert

**References:**
- Asset requirements: `/images/*/README.md` files
- Sample testimonials: `/images/testimonials/SAMPLE-TESTIMONIALS.md`
- Implementation guide: `ASSET_GUIDE.md`
- Summary: `IMPLEMENTATION_SUMMARY.md`

---

**Last Updated:** November 2025
**Version:** 1.0
**Status:** Ready for asset acquisition
