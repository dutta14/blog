import { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { posts, featuredSlugs, TAG_LABELS } from '../data/posts';
import PostCard from '../components/PostCard';
import TagPill from '../components/TagPill';
import NewsletterCTA from '../components/NewsletterCTA';
import '../styles/Home.css';

const TAG_KEYS = Object.keys(TAG_LABELS);

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTag = searchParams.get('tag') ?? null;

  const handleTagClick = useCallback((tag: string) => {
    window.umami?.track('tag-filter', { tag });
    setSearchParams(prev => {
      if (prev.get('tag') === tag) {
        prev.delete('tag');
      } else {
        prev.set('tag', tag);
      }
      return prev;
    });
  }, [setSearchParams]);

  const featured = posts.filter(p => featuredSlugs.has(p.slug));
  const rest = posts.filter(p => !featuredSlugs.has(p.slug));

  const filteredPosts = activeTag
    ? posts.filter(p => p.tags.includes(activeTag))
    : rest;

  const headingText = activeTag
    ? (TAG_LABELS[activeTag] ?? activeTag)
    : 'All Posts';

  return (
    <>
      <Helmet>
        <title>Writing — Anindya Dutta</title>
        <meta name="description" content="Essays on engineering, leadership, and building things. By Anindya Dutta." />
        <meta property="og:title" content="Writing — Anindya Dutta" />
        <meta property="og:description" content="Essays on engineering, leadership, and building things." />
        <meta property="og:url" content="https://anindya.dev/blog" />
        <meta property="og:image" content="https://anindya.dev/img/og-card.png" />
        <link rel="canonical" href="https://anindya.dev/blog" />
      </Helmet>
      <main className="container">
        <div className="home">
          <div className="home-header">
            <h1>Writing</h1>
            <p className="home-subtitle">Essays on engineering, leadership, and building things.</p>
          </div>

          <div className="tag-filter-bar" role="toolbar" aria-label="Filter posts by topic">
            {TAG_KEYS.map(tag => (
              <TagPill
                key={tag}
                variant="filter"
                tag={tag}
                active={activeTag === tag}
                onClick={handleTagClick}
              />
            ))}
          </div>

          {posts.length === 0 ? (
            <p className="empty-state">Nothing here yet. Come back soon.</p>
          ) : (
            <>
              {!activeTag && featured.length > 0 && (
                <div className="featured-section">
                  <h2 className="featured-heading">Featured</h2>
                  <ul className="post-list">
                    {featured.map(post => (
                      <PostCard key={post.slug} post={post} />
                    ))}
                  </ul>
                </div>
              )}

              {!activeTag && <NewsletterCTA variant="compact" location="home" />}

              <h2 className="all-posts-heading" aria-live="polite">{headingText}</h2>

              {filteredPosts.length > 0 ? (
                <ul className="post-list">
                  {filteredPosts.map(post => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </ul>
              ) : (
                <p className="empty-state">
                  No posts tagged &ldquo;{TAG_LABELS[activeTag!] ?? activeTag}&rdquo; yet. More essays are on the way.
                </p>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
