import { Link } from 'react-router-dom';
import type { Post } from '../data/posts';
import { posts } from '../data/posts';

interface Props {
  current: Post;
}

export default function PostNav({ current }: Props) {
  const currentIndex = posts.findIndex(p => p.slug === current.slug);
  if (currentIndex === -1) return null;

  // posts are sorted newest first, so "next" (newer) is index - 1, "prev" (older) is index + 1
  const newer = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const older = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  if (!newer && !older) return null;

  return (
    <nav className="post-nav" aria-label="Previous and next posts">
      {older && (
        <Link
          to={`/post/${older.slug}`}
          className="post-nav-link post-nav-link--prev"
          aria-label={`Previous post: ${older.title}`}
        >
          <span className="post-nav-direction">← Previous</span>
          <span className="post-nav-title">{older.title}</span>
        </Link>
      )}
      {newer && (
        <Link
          to={`/post/${newer.slug}`}
          className="post-nav-link post-nav-link--next"
          aria-label={`Next post: ${newer.title}`}
        >
          <span className="post-nav-direction">Next →</span>
          <span className="post-nav-title">{newer.title}</span>
        </Link>
      )}
    </nav>
  );
}
