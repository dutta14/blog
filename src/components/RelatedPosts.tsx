import { Link } from 'react-router-dom';
import type { Post } from '../data/posts';
import { posts } from '../data/posts';
import { readingTime } from '../utils/readingTime';

interface Props {
  current: Post;
}

function getRelatedPosts(current: Post): Post[] {
  const others = posts.filter(p => p.slug !== current.slug);

  // Score by tag overlap
  const scored = others.map(p => ({
    post: p,
    score: p.tags.filter(t => current.tags.includes(t)).length,
  }));

  // Sort by score desc, then by date proximity
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const aDate = Math.abs(new Date(a.post.date).getTime() - new Date(current.date).getTime());
    const bDate = Math.abs(new Date(b.post.date).getTime() - new Date(current.date).getTime());
    return aDate - bDate;
  });

  // Take up to 3, but at least 2 if possible
  const result: Post[] = [];
  for (const item of scored) {
    if (result.length >= 3) break;
    result.push(item.post);
  }

  return result;
}

export default function RelatedPosts({ current }: Props) {
  const related = getRelatedPosts(current);

  if (related.length === 0) return null;

  return (
    <>
      <hr className="post-section-divider" aria-hidden="true" />
      <aside className="related-posts" aria-labelledby="related-posts-heading">
        <h2 className="related-posts-heading" id="related-posts-heading">Keep reading</h2>
        <ul className="related-posts-list">
          {related.map(post => (
            <li key={post.slug} className="related-post-card">
              <Link to={`/post/${post.slug}`} className="related-post-link">
                <span className="related-post-title">{post.title}</span>
                <span className="related-post-excerpt">{post.excerpt}</span>
                <span className="related-post-meta">
                  {post.date}
                  <span aria-hidden="true"> · </span>
                  {readingTime(post.content)} min read
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
