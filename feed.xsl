<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title><xsl:value-of select="/rss/channel/title" /> — RSS Feed</title>
        <style>
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: #fafafa;
            padding: 2rem 1rem;
          }

          .container { max-width: 640px; margin: 0 auto; }

          .banner {
            background: #f0fdfa;
            border: 1px solid #99f6e4;
            border-radius: 8px;
            padding: 1rem 1.25rem;
            margin-bottom: 2rem;
            font-size: 0.875rem;
            color: #115e59;
          }

          .banner strong { display: block; margin-bottom: 0.25rem; font-size: 0.9375rem; }

          .banner code {
            background: #ccfbf1;
            padding: 0.125rem 0.375rem;
            border-radius: 4px;
            font-size: 0.8125rem;
            word-break: break-all;
          }

          h1 {
            font-family: 'EB Garamond', Georgia, serif;
            font-size: 1.75rem;
            font-weight: 500;
            margin-bottom: 0.25rem;
          }

          .subtitle {
            color: #6b7280;
            font-size: 0.9375rem;
            margin-bottom: 2rem;
          }

          .post {
            padding: 1.25rem 0;
            border-bottom: 1px solid #e5e7eb;
          }

          .post:last-child { border-bottom: none; }

          .post-title {
            font-size: 1.0625rem;
            font-weight: 500;
            line-height: 1.4;
          }

          .post-title a {
            color: #1a1a1a;
            text-decoration: none;
          }

          .post-title a:hover { color: #0f766e; }

          .post-date {
            font-size: 0.8125rem;
            color: #9ca3af;
            margin-top: 0.25rem;
          }

          .post-excerpt {
            font-size: 0.9375rem;
            color: #4b5563;
            margin-top: 0.5rem;
          }

          @media (prefers-color-scheme: dark) {
            body { background: #111; color: #e5e7eb; }
            .banner { background: #042f2e; border-color: #115e59; color: #99f6e4; }
            .banner code { background: #0f766e; color: #f0fdfa; }
            h1 { color: #f3f4f6; }
            .subtitle { color: #9ca3af; }
            .post { border-color: #374151; }
            .post-title a { color: #f3f4f6; }
            .post-title a:hover { color: #14b8a6; }
            .post-date { color: #6b7280; }
            .post-excerpt { color: #9ca3af; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="banner">
            <strong>This is an RSS feed</strong>
            Copy the URL into your favorite feed reader to subscribe.
            <br /><br />
            <code><xsl:value-of select="/rss/channel/atom:link/@href" /></code>
          </div>

          <h1><xsl:value-of select="/rss/channel/title" /></h1>
          <p class="subtitle"><xsl:value-of select="/rss/channel/description" /></p>

          <xsl:for-each select="/rss/channel/item">
            <div class="post">
              <div class="post-title">
                <a>
                  <xsl:attribute name="href"><xsl:value-of select="link" /></xsl:attribute>
                  <xsl:value-of select="title" />
                </a>
              </div>
              <div class="post-date"><xsl:value-of select="pubDate" /></div>
              <xsl:if test="description != ''">
                <div class="post-excerpt"><xsl:value-of select="description" /></div>
              </xsl:if>
            </div>
          </xsl:for-each>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
