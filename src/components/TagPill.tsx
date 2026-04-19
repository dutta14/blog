import { Link } from 'react-router-dom';
import { TAG_LABELS } from '../data/posts';

interface FilterProps {
  variant: 'filter';
  tag: string;
  active: boolean;
  onClick: (tag: string) => void;
}

interface InlineProps {
  variant: 'inline';
  tag: string;
}

type Props = FilterProps | InlineProps;

export default function TagPill(props: Props) {
  const label = TAG_LABELS[props.tag] ?? props.tag;

  if (props.variant === 'filter') {
    return (
      <button
        className={`tag-pill tag-pill--filter${props.active ? ' tag-pill--active' : ''}`}
        aria-pressed={props.active}
        data-tag={props.tag}
        onClick={() => props.onClick(props.tag)}
      >
        {label}
      </button>
    );
  }

  return (
    <Link
      className="tag-pill tag-pill--inline"
      to={`/?tag=${props.tag}`}
    >
      {label}
    </Link>
  );
}
