export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
}

export const TAG_LABELS: Record<string, string> = {
  'ai-products': 'AI Products',
  'engineering-leadership': 'Leadership',
  'career': 'Career',
  'big-tech': 'Big Tech',
  'building': 'Building',
};

function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw.trim() };
  const data: Record<string, string> = {};
  match[1].split('\n').forEach(line => {
    const colon = line.indexOf(':');
    if (colon !== -1) {
      data[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
    }
  });
  return { data, content: match[2].trim() };
}

function parseTags(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw.split(',').map(t => t.trim()).filter(Boolean);
}

const modules = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export const posts: Post[] = Object.entries(modules)
  .map(([path, raw]) => {
    const slug = path.replace('../posts/', '').replace('.md', '');
    const { data, content } = parseFrontmatter(raw);
    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? '',
      excerpt: data.excerpt ?? '',
      content,
      tags: parseTags(data.tags),
    };
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const startHereSlugs = [
  'the-chatgpt-moment-from-inside-microsoft',
  'amazon-writing-culture',
  'the-first-day-at-samsung',
  'why-i-left-microsoft-for-meta',
  'the-year-i-stopped-writing-code',
  'what-enterprise-software-is-actually-like-to-build',
  'samsung-amazon-microsoft-meta-microsoft-again',
];

/** @deprecated Use startHereSlugs instead */
export const featuredSlugs = new Set(startHereSlugs);
