import { useParams, Link } from 'react-router-dom';
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
  );
}
