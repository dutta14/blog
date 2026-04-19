import { Link } from 'react-router-dom';
import type { Post } from '../data/posts';
import { readingTime } from '../utils/readingTime';
import TagPill from './TagPill';

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  const minutes = readingTime(post.content);

  return (
    <li className="post-item">
      <div className="post-item-meta">
        {post.date}
        <span className="post-item-separator" aria-hidden="true"> · </span>
        <span className="post-item-reading-time">{minutes} min read</span>
      </div>
      <h2 className="post-item-title">
        <Link to={`/post/${post.slug}`}>{post.title}</Link>
      </h2>
      <p className="post-item-excerpt">{post.excerpt}</p>
      {post.tags.length > 0 && (
        <div className="post-item-tags" aria-label="Topics">
          {post.tags.map(tag => (
            <TagPill key={tag} variant="inline" tag={tag} />
          ))}
        </div>
      )}
    </li>
  );
}
