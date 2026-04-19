import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const postsDir = join(__dirname, '../src/posts');
const outFile = join(__dirname, '../public/posts.json');

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw.trim() };
  const data = {};
  match[1].split('\n').forEach(line => {
    const colon = line.indexOf(':');
    if (colon !== -1) data[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
  });
  return { data, content: match[2].trim() };
}

const posts = readdirSync(postsDir)
  .filter(f => f.endsWith('.md'))
  .map(file => {
    const slug = file.replace('.md', '');
    const raw = readFileSync(join(postsDir, file), 'utf-8');
    const { data } = parseFrontmatter(raw);
    return { slug, title: data.title ?? slug, date: data.date ?? '', excerpt: data.excerpt ?? '' };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date));

writeFileSync(outFile, JSON.stringify(posts, null, 2));
console.log(`Generated posts.json with ${posts.length} posts`);

const sitemapUrls = posts.map(p => `  <url>
    <loc>https://anindya.dev/blog/post/${p.slug}</loc>
    <lastmod>${new Date(p.date).toISOString().split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://anindya.dev/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://anindya.dev/blog/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://anindya.dev/blog/subscribe</loc>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
${sitemapUrls}
</urlset>`;

writeFileSync(join(__dirname, '../public/sitemap.xml'), sitemap);
console.log(`Generated sitemap.xml with ${posts.length + 3} URLs`);

const rssItems = posts.slice(0, 20).map(p => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>https://anindya.dev/blog/post/${p.slug}</link>
      <guid>https://anindya.dev/blog/post/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
    </item>`).join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/blog/feed.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Anindya Dutta</title>
    <link>https://anindya.dev/blog</link>
    <description>Essays on engineering, leadership, and building things.</description>
    <language>en-us</language>
    <atom:link href="https://anindya.dev/blog/feed.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`;

writeFileSync(join(__dirname, '../public/feed.xml'), rss);
console.log(`Generated feed.xml with ${Math.min(posts.length, 20)} items`);
