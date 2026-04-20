import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import { posts } from '../data/posts';
import { readingTime } from '../utils/readingTime';
import TagPill from '../components/TagPill';
import ShareBar from '../components/ShareBar';
import RelatedPosts from '../components/RelatedPosts';
import NewsletterCTA from '../components/NewsletterCTA';
import CaseStudyCallout from '../components/CaseStudyCallout';
import ReadingProgress from '../components/ReadingProgress';
import AuthorCard from '../components/AuthorCard';
import PostNav from '../components/PostNav';
import '../styles/Post.css';

const SCROLL_THRESHOLDS = [25, 50, 75, 100] as const;

function useScrollDepth(slug: string | undefined, readingTimeMin: number) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const firedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    firedRef.current = new Set();
  }, [slug]);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body || !slug || typeof IntersectionObserver === 'undefined') return;

    const sentinels: HTMLDivElement[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const depth = Number(entry.target.getAttribute('data-depth'));
          if (!firedRef.current.has(depth)) {
            firedRef.current.add(depth);
            window.umami?.track('scroll-depth', { depth, slug, readingTime: readingTimeMin });
          }
        }
      },
      { threshold: 0 },
    );

    for (const pct of SCROLL_THRESHOLDS) {
      const sentinel = document.createElement('div');
      sentinel.setAttribute('data-depth', String(pct));
      sentinel.setAttribute('aria-hidden', 'true');
      sentinel.style.height = '1px';
      sentinel.style.width = '1px';
      sentinel.style.position = 'absolute';
      sentinel.style.pointerEvents = 'none';
      sentinel.style.opacity = '0';
      sentinel.style.top = `${pct}%`;
      sentinel.style.left = '0';
      body.style.position = 'relative';
      body.appendChild(sentinel);
      sentinels.push(sentinel);
      observer.observe(sentinel);
    }

    return () => {
      observer.disconnect();
      for (const s of sentinels) s.remove();
    };
  }, [slug, readingTimeMin]);

  return bodyRef;
}

function toISODate(dateStr: string): string {
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? dateStr : d.toISOString().split('T')[0];
}

export default function Post() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = posts.find(p => p.slug === slug);

  const minutes = post ? readingTime(post.content) : 0;
  const wordCount = post ? post.content.trim().split(/\s+/).length : 0;
  const bodyRef = useScrollDepth(post?.slug, minutes);

  useEffect(() => {
    if (post?.slug) {
      window.umami?.track('post-view', { slug: post.slug, readingTime: minutes });
    }
  }, [post?.slug, minutes]);

  const jsonLd = useMemo(() => {
    if (!post) return null;
    const postUrl = `https://anindya.dev/blog/post/${post.slug}`;
    const author = {
      '@type': 'Person' as const,
      name: 'Anindya Dutta',
      url: 'https://anindya.dev',
      jobTitle: 'Principal SWE Manager',
      worksFor: { '@type': 'Organization' as const, name: 'Microsoft' },
      sameAs: [
        'https://linkedin.com/in/dutta14',
        'https://github.com/dutta14',
        'https://anindya.dev/blog',
      ],
    };

    const blogPosting = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: toISODate(post.date),
      author,
      publisher: { '@type': 'Person', name: 'Anindya Dutta', url: 'https://anindya.dev' },
      mainEntityOfPage: postUrl,
      wordCount,
      timeRequired: `PT${minutes}M`,
      image: `https://anindya.dev/blog/og/${post.slug}.png`,
      url: postUrl,
    };

    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Writing', item: 'https://anindya.dev/blog' },
        { '@type': 'ListItem', position: 2, name: post.title, item: postUrl },
      ],
    };

    return { blogPosting, breadcrumb };
  }, [post, minutes, wordCount]);

  if (!post) {
    return (
      <main className="container">
        <div className="post-not-found">Post not found.</div>
      </main>
    );
  }

  const postUrl = `https://anindya.dev/blog/post/${post.slug}`;

  return (
    <>
      <ReadingProgress />
      <Helmet>
        <title>{post.title} — Anindya Dutta</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`https://anindya.dev/blog/og/${post.slug}.png`} />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={`https://anindya.dev/blog/og/${post.slug}.png`} />
        <link rel="canonical" href={postUrl} />
        {jsonLd && (
          <script type="application/ld+json">{JSON.stringify(jsonLd.blogPosting)}</script>
        )}
        {jsonLd && (
          <script type="application/ld+json">{JSON.stringify(jsonLd.breadcrumb)}</script>
        )}
      </Helmet>
      <main className="container">
        <div className="post-page">
          <button
            type="button"
            className="post-back"
            onClick={() => navigate('/', { state: { restoreScroll: true } })}
          >Back to Writing</button>
          <div className="post-header">
            <h1 className="post-title">{post.title}</h1>
            <div className={`post-date${post.tags.length === 0 ? '' : ' post-date--no-border'}`}>
              {post.date}
              <span className="post-date-separator" aria-hidden="true"> · </span>
              <span className="post-reading-time">{minutes} min read</span>
            </div>
            {post.tags.length > 0 && (
              <div className="post-tags" aria-label="Post topics">
                {post.tags.map(tag => (
                  <TagPill key={tag} variant="inline" tag={tag} />
                ))}
              </div>
            )}
            <ShareBar title={post.title} url={postUrl} />
          </div>
          <div className="post-body" ref={bodyRef}>
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
          <AuthorCard />
          <RelatedPosts current={post} />
          <CaseStudyCallout postSlug={post.slug} />
          <NewsletterCTA />
          <PostNav current={post} />
        </div>
      </main>
    </>
  );
}
