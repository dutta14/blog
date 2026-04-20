import { Link } from 'react-router-dom';
import type { Post } from '../data/posts';
import '../styles/StartHere.css';

interface Props {
  posts: Post[];
}

export default function StartHere({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section className="start-here" aria-labelledby="start-here-heading">
      <div className="start-here-header">
        <h2 className="start-here-heading" id="start-here-heading">
          Start here
        </h2>
        <p className="start-here-description">
          New to the blog? These essays capture what I write about most.
        </p>
      </div>
      <ol className="start-here-list">
        {posts.map((post) => (
          <li key={post.slug} className="start-here-item">
            <Link to={`/post/${post.slug}`} className="start-here-link">
              <span className="start-here-title">{post.title}</span>
              <span className="start-here-excerpt">{post.excerpt}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
