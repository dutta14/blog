import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TagPill from './TagPill';
import { renderWithRouter } from '../test/helpers';

describe('TagPill', () => {
  it('renders the tag display label from TAG_LABELS mapping', () => {
    renderWithRouter(<TagPill variant="inline" tag="ai-products" />);
    expect(screen.getByText('AI Products')).toBeInTheDocument();
  });

  it('filter variant renders as a button with aria-pressed="false" by default', () => {
    renderWithRouter(
      <TagPill variant="filter" tag="ai-products" active={false} onClick={() => {}} />
    );
    const button = screen.getByRole('button', { name: 'AI Products' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('filter variant renders aria-pressed="true" when active', () => {
    renderWithRouter(
      <TagPill variant="filter" tag="ai-products" active={true} onClick={() => {}} />
    );
    const button = screen.getByRole('button', { name: 'AI Products' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('filter variant calls onClick with the tag slug when clicked', async () => {
    const user = userEvent.setup();
    let clickedTag = '';
    renderWithRouter(
      <TagPill variant="filter" tag="career" active={false} onClick={(t) => { clickedTag = t; }} />
    );
    await user.click(screen.getByRole('button', { name: 'Career' }));
    expect(clickedTag).toBe('career');
  });

  it('inline variant renders as a link pointing to /?tag={slug}', () => {
    renderWithRouter(<TagPill variant="inline" tag="big-tech" />);
    const link = screen.getByRole('link', { name: 'Big Tech' });
    expect(link).toHaveAttribute('href', '/?tag=big-tech');
  });

  it('falls back to raw tag slug when TAG_LABELS has no mapping', () => {
    renderWithRouter(<TagPill variant="inline" tag="unknown-tag" />);
    expect(screen.getByText('unknown-tag')).toBeInTheDocument();
  });
});
