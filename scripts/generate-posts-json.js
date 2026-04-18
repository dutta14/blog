import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

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
