import { Helmet } from 'react-helmet-async';
import { posts, featuredSlugs } from '../data/posts';
import PostCard from '../components/PostCard';
import '../styles/Home.css';

export default function Home() {
  const featured = posts.filter(p => featuredSlugs.has(p.slug));
  const rest = posts.filter(p => !featuredSlugs.has(p.slug));

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
          {posts.length === 0 ? (
            <p className="empty-state">Nothing here yet. Come back soon.</p>
          ) : (
            <>
              {featured.length > 0 && (
                <div className="featured-section">
                  <h2 className="featured-heading">Featured</h2>
                  <ul className="post-list">
                    {featured.map(post => (
                      <PostCard key={post.slug} post={post} />
                    ))}
                  </ul>
                </div>
              )}
              <h2 className="all-posts-heading">All Posts</h2>
              <ul className="post-list">
                {rest.map(post => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </ul>
            </>
          )}
        </div>
      </main>
    </>
  );
}
