/** @type {import('next-sitemap').IConfig} */
const nextSitemapConfig = {
  siteUrl: "https://compyle.tracepanic.com",
  changefreq: "weekly",
  priority: "0.5",
  generateIndexSitemap: false,
  exclude: ["/icon0.svg", "icon1.png"],
};

export default nextSitemapConfig;
