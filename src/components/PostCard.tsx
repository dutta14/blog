import { Link } from 'react-router-dom';
import type { Post } from '../data/posts';

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  return (
    <li className="post-item">
      <div className="post-item-meta">{post.date}</div>
      <h2 className="post-item-title">
        <Link to={`/post/${post.slug}`}>{post.title}</Link>
      </h2>
      <p className="post-item-excerpt">{post.excerpt}</p>
    </li>
  );
}
