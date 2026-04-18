import { posts } from '../data/posts';
import PostCard from '../components/PostCard';
import '../styles/Home.css';

export default function Home() {
  return (
    <main className="container">
      <div className="home">
        <div className="home-header">
          <h1>Writing</h1>
          <p className="home-subtitle">Essays on engineering, leadership, and building things.</p>
        </div>
        {posts.length === 0 ? (
          <p className="empty-state">Nothing here yet. Come back soon.</p>
        ) : (
          <ul className="post-list">
            {posts.map(post => (
              <PostCard key={post.slug} post={post} />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
