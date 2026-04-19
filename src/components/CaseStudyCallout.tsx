const CASE_STUDY_MAP: Record<string, { slug: string; title: string }> = {
  'what-it-felt-like-to-ship-to-five-million-people': { slug: 'alexa-hands-free', title: 'Alexa Hands-Free' },
  'building-for-india-from-seattle': { slug: 'alexa-hands-free', title: 'Alexa Hands-Free' },
  'building-voice-on-a-phone-with-bad-signal': { slug: 'alexa-hands-free', title: 'Alexa Hands-Free' },
  'the-first-copilot-feature-nobody-saw': { slug: 'voice-assistant-outlook', title: 'Voice Assistant in Outlook' },
  'the-chatgpt-moment-from-inside-microsoft': { slug: 'm365-copilot', title: 'M365 Copilot' },
  'what-copilot-is-becoming': { slug: 'm365-copilot', title: 'M365 Copilot' },
};

interface Props {
  postSlug: string;
}

export default function CaseStudyCallout({ postSlug }: Props) {
  const caseStudy = CASE_STUDY_MAP[postSlug];
  if (!caseStudy) return null;

  return (
    <div className="case-study-callout">
      <div className="case-study-callout-content">
        <span className="case-study-callout-label">From the portfolio</span>
        <span className="case-study-callout-title">{caseStudy.title}</span>
        <span className="case-study-callout-description">
          See the product, team structure, and engineering decisions behind this project.
        </span>
      </div>
      <a
        href="https://anindya.dev/#products"
        className="case-study-callout-link"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${caseStudy.title} case study on portfolio site (opens in new tab)`}
        onClick={() => window.umami?.track('case-study-callout-click', { caseStudy: caseStudy.slug })}
      >
        View case study →
      </a>
    </div>
  );
}
