import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { posts, startHereSlugs } from '../data/posts';
import '../styles/About.css';

export default function About() {
  const startHerePosts = startHereSlugs
    .slice(0, 4)
    .map(slug => posts.find(p => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => p != null);

  return (
    <>
      <Helmet>
        <title>About — Anindya Dutta</title>
        <meta name="description" content="I have been writing since 2010, mostly to make sense of things. About Anindya Dutta." />
        <meta property="og:title" content="About — Anindya Dutta" />
        <meta property="og:description" content="I have been writing since 2010, mostly to make sense of things." />
        <meta property="og:url" content="https://anindya.dev/blog/about" />
        <meta property="og:image" content="https://anindya.dev/img/og-card.png" />
        <link rel="canonical" href="https://anindya.dev/blog/about" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Anindya Dutta',
          url: 'https://anindya.dev',
          jobTitle: 'Principal SWE Manager',
          worksFor: { '@type': 'Organization', name: 'Microsoft' },
          description: 'Engineering leader and writer. Builds AI products at Microsoft (M365 Copilot). Has been writing since 2010 about engineering, leadership, and building things.',
          sameAs: [
            'https://linkedin.com/in/dutta14',
            'https://github.com/dutta14',
            'https://anindya.dev/blog',
          ],
        })}</script>
      </Helmet>
      <main className="container">
      <div className="about-page">
        <h1>About</h1>
        <p>
          I lead the team that builds M365 Copilot at Microsoft, the AI inside Outlook, Teams, and Office.{' '}
          I have been writing since 2010, mostly to make sense of things. The cities I have lived in.
          The jobs I have taken. The decisions that seemed obvious at the time and confusing in hindsight,
          or the other way around.
        </p>
        <p>
          For a long time I wrote on a WordPress blog that almost nobody read, and I liked it that way.
          There is something freeing about writing into a quiet room. No one expecting anything. No angle
          to work. Just the page and whatever is on your mind.
        </p>
        <p>
          I build software for a living. I have done it for twelve years, at companies large and small,
          as an engineer and then as a manager of engineers. Most of what I write here comes from that
          world, but I try not to write about it the way people usually do. No frameworks. No lessons.
          Just what it was actually like to be in the room.
        </p>
        <p>
          If something here stays with you, I am glad. If you want to say something back, you can find
          me at <a href="https://anindya.dev">anindya.dev</a>.
        </p>
        {startHerePosts.length > 0 && (
          <section className="about-start-here" aria-labelledby="about-start-here-heading">
            <h2 className="about-start-here-heading" id="about-start-here-heading">
              Start here
            </h2>
            <p className="about-start-here-description">
              If you're new, these essays capture what I write about most.
            </p>
            <ol className="about-start-here-list">
              {startHerePosts.map(post => (
                <li className="about-start-here-item" key={post.slug}>
                  <Link to={`/post/${post.slug}`} className="about-start-here-link">
                    {post.title}
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </main>
    </>
  );
}
