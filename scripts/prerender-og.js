/**
 * Post-build script: generates a static HTML shell for each blog post
 * with correct OG/Twitter meta tags so social media crawlers (LinkedIn,
 * Twitter, Facebook) can read them without executing JavaScript.
 *
 * Reads the Vite-built dist/index.html, injects per-post meta tags,
 * and writes to dist/post/{slug}/index.html.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const postsDir = join(__dirname, '../src/posts');
const distDir = join(__dirname, '../dist');

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

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Read the built index.html as the template
const template = readFileSync(join(distDir, 'index.html'), 'utf-8');

// Read all posts
const posts = readdirSync(postsDir)
  .filter(f => f.endsWith('.md'))
  .map(file => {
    const slug = file.replace('.md', '');
    const raw = readFileSync(join(postsDir, file), 'utf-8');
    const { data } = parseFrontmatter(raw);
    return { slug, title: data.title ?? slug, excerpt: data.excerpt ?? '' };
  });

let count = 0;
for (const post of posts) {
  const url = `https://anindya.dev/blog/post/${post.slug}`;
  const title = escapeHtml(post.title);
  const excerpt = escapeHtml(post.excerpt);

  // Build the post-specific meta tags
  const metaTags = `
    <title>${title} — Anindya Dutta</title>
    <meta name="description" content="${excerpt}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${excerpt}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:type" content="article" />
    <meta property="og:image" content="https://anindya.dev/img/og-card.png" />
    <meta property="og:site_name" content="Anindya Dutta" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${excerpt}" />
    <meta name="twitter:image" content="https://anindya.dev/img/og-card.png" />
    <link rel="canonical" href="${url}" />`;

  // Replace the generic meta tags in the template with post-specific ones
  let html = template;

  // Replace <title>
  html = html.replace(/<title>[^<]*<\/title>/, '');
  // Replace existing og/twitter/description meta tags
  html = html.replace(/<meta name="description"[^>]*>/g, '');
  html = html.replace(/<meta property="og:[^>]*>/g, '');
  html = html.replace(/<meta name="twitter:[^>]*>/g, '');
  html = html.replace(/<link rel="canonical"[^>]*>/g, '');

  // Inject post-specific meta tags after <meta charset>
  html = html.replace(
    '<meta charset="UTF-8" />',
    `<meta charset="UTF-8" />${metaTags}`
  );

  // Write to dist/post/{slug}/index.html
  const outDir = join(distDir, 'post', post.slug);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html);
  count++;
}

console.log(`Prerendered OG tags for ${count} post pages`);
