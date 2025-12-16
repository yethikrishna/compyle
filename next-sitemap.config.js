/** @type {import('next-sitemap').IConfig} */
const nextSitemapConfig = {
  siteUrl: "https://compyle.tracepanic.com",
  changefreq: "weekly",
  priority: 0.5,
  generateIndexSitemap: false,
  exclude: ["/icon.png", "/apple-icon.png", "/manifest.json", "/dashboard/**"],
};

export default nextSitemapConfig;
