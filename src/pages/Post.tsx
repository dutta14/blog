import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import { posts } from '../data/posts';
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

  return (
    <>
      <Helmet>
        <title>{post.title} — Anindya Dutta</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={`https://anindya.dev/blog/post/${post.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://anindya.dev/img/og-card.png" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content="https://anindya.dev/img/og-card.png" />
        <link rel="canonical" href={`https://anindya.dev/blog/post/${post.slug}`} />
      </Helmet>
      <main className="container">
        <div className="post-page">
          <Link to="/" className="post-back">Back to Writing</Link>
          <div className="post-header">
            <h1 className="post-title">{post.title}</h1>
            <div className="post-date">{post.date}</div>
          </div>
          <div className="post-body">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>
      </main>
    </>
  );
}
