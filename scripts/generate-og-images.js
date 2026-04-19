/**
 * Build-time script: generates unique OG images (1200×630 PNG) for each blog post.
 * Uses satori (JSX → SVG) + sharp (SVG → PNG).
 * Runs after `vite build`, before `prerender-og.js`.
 */
import { readdirSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import satori from 'satori';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const postsDir = join(__dirname, '../src/posts');
const outDir = join(__dirname, '../dist/og');

// Load Inter fonts (static weights)
const regularPath = join(__dirname, 'fonts/Inter-Regular.ttf');
const boldPath = join(__dirname, 'fonts/Inter-Bold.ttf');
if (!existsSync(regularPath) || !existsSync(boldPath)) {
  console.error('Error: Font files not found at scripts/fonts/Inter-{Regular,Bold}.ttf');
  process.exit(1);
}
const interRegular = readFileSync(regularPath);
const interBold = readFileSync(boldPath);

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

function truncate(str, max) {
  if (!str || str.length <= max) return str || '';
  return str.slice(0, max - 1).trim() + '…';
}

function readingTime(content) {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

async function generateOgImage(post) {
  const title = truncate(post.title, 80);
  const excerpt = truncate(post.excerpt, 120);
  const minutes = readingTime(post.content);

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          backgroundColor: '#0f172a',
          position: 'relative',
        },
        children: [
          // Teal accent bar
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                left: 0,
                top: 0,
                width: '6px',
                height: '630px',
                backgroundColor: '#0f766e',
              },
            },
          },
          // Content area
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '80px 80px 50px 80px',
                width: '100%',
                height: '100%',
              },
              children: [
                // Top: title + excerpt
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', flexDirection: 'column' },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '48px',
                            fontWeight: 700,
                            color: '#f1f5f9',
                            lineHeight: 1.2,
                            maxWidth: '1000px',
                          },
                          children: title,
                        },
                      },
                      excerpt ? {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '22px',
                            fontWeight: 400,
                            color: '#94a3b8',
                            lineHeight: 1.4,
                            maxWidth: '1000px',
                            marginTop: '24px',
                          },
                          children: excerpt,
                        },
                      } : null,
                    ].filter(Boolean),
                  },
                },
                // Bottom: author + reading time
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '20px',
                            color: '#64748b',
                          },
                          children: 'Anindya Dutta · anindya.dev/blog',
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '18px',
                            color: '#0f766e',
                          },
                          children: `${minutes} min read`,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
        { name: 'Inter', data: interBold, weight: 700, style: 'normal' },
      ],
    }
  );

  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toFile(join(outDir, `${post.slug}.png`));
}

// Main
mkdirSync(outDir, { recursive: true });

const posts = readdirSync(postsDir)
  .filter(f => f.endsWith('.md'))
  .map(file => {
    const slug = file.replace('.md', '');
    const raw = readFileSync(join(postsDir, file), 'utf-8');
    const { data, content } = parseFrontmatter(raw);
    return { slug, title: data.title ?? slug, excerpt: data.excerpt ?? '', content };
  });

let count = 0;
let errors = 0;
for (const post of posts) {
  try {
    await generateOgImage(post);
    count++;
  } catch (err) {
    console.warn(`Warning: Failed to generate OG image for "${post.slug}": ${err.message}`);
    errors++;
  }
}

console.log(`Generated ${count} OG images${errors > 0 ? ` (${errors} failed)` : ''}`);
