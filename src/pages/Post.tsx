import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import { posts } from '../data/posts';
import { readingTime } from '../utils/readingTime';
import TagPill from '../components/TagPill';
import ShareBar from '../components/ShareBar';
import RelatedPosts from '../components/RelatedPosts';
import NewsletterCTA from '../components/NewsletterCTA';
import CaseStudyCallout from '../components/CaseStudyCallout';
import PostNav from '../components/PostNav';
import '../styles/Post.css';

export default function Post() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = posts.find(p => p.slug === slug);

  const minutes = post ? readingTime(post.content) : 0;

  useEffect(() => {
    if (post?.slug) {
      window.umami?.track('post-view', { slug: post.slug, readingTime: minutes });
    }
  }, [post?.slug, minutes]);

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
          <div className="post-body">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
          <RelatedPosts current={post} />
          <CaseStudyCallout postSlug={post.slug} />
          <NewsletterCTA />
          <PostNav current={post} />
        </div>
      </main>
    </>
  );
}
