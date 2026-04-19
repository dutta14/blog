import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import { posts } from '../data/posts';
import { readingTime } from '../utils/readingTime';
import TagPill from '../components/TagPill';
import ShareBar from '../components/ShareBar';
import RelatedPosts from '../components/RelatedPosts';
import CaseStudyCallout from '../components/CaseStudyCallout';
import EnjoyedCard from '../components/EnjoyedCard';
import PostNav from '../components/PostNav';
import '../styles/Post.css';

export default function Post() {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return (
      <main className="container">
        <div className="post-not-found">Post not found.</div>
      </main>
    );
  }

  const minutes = readingTime(post.content);
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
        <meta property="og:image" content="https://anindya.dev/img/og-card.png" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content="https://anindya.dev/img/og-card.png" />
        <link rel="canonical" href={postUrl} />
      </Helmet>
      <main className="container">
        <div className="post-page">
          <Link to="/" className="post-back">Back to Writing</Link>
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
          <EnjoyedCard />
          <PostNav current={post} />
        </div>
      </main>
    </>
  );
}
